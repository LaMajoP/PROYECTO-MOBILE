import React, { useEffect, useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../../lib/supabaseClient";

/* ======================================================
      TIPOS
====================================================== */
type CartRow = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  added_at: string;
  products: {
    name: string;
    image_url: string | null;
    stock?: number;
  };
};

const HistoryScreen: React.FC = () => {
  const [cart, setCart] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // 🟦 nuevo

  /* ======================================================
      1. CARGAR CARRITO REAL DESDE SUPABASE
  ====================================================== */
  const loadCart = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        unit_price,
        added_at,
        products:fk_cart_product (
          name,
          image_url,
          stock
        )
      `)
      .eq("user_id", auth.user.id);

    if (error) {
      console.log("❌ Error cargando carrito:", error);
      return;
    }

    setCart(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  /* ======================================================
      2. PULL TO REFRESH
  ====================================================== */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadCart();
    setRefreshing(false);
  };

  /* ======================================================
      3. CAMBIAR CANTIDAD
  ====================================================== */
  const handleChangeQuantity = async (id: string, delta: 1 | -1) => {
    const item = cart.find((x) => x.id === id);
    if (!item) return;

    // mínima cantidad permitida: 1
    if (delta === -1 && item.quantity === 1) return;

    // máxima cantidad = stock (si existe)
    if (delta === 1 && item.products.stock && item.quantity >= item.products.stock) {
      Alert.alert("Stock insuficiente", "No puedes agregar más unidades.");
      return;
    }

    const newQty = Math.max(1, item.quantity + delta);

    await supabase.from("cart_items").update({ quantity: newQty }).eq("id", id);

    loadCart();
  };

  /* ======================================================
      4. ELIMINAR ITEM
  ====================================================== */
  const deleteItem = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    loadCart();
  };

  /* ======================================================
      5. TOTAL FINAL
  ====================================================== */
  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),
    [cart]
  );

  const formatPrice = (v: number) => v.toFixed(3);

  /* ======================================================
      6. CHECKOUT REAL (ACTUALIZADO CON DETALLES)
  ====================================================== */
  const handleCheckout = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    if (cart.length === 0) {
      Alert.alert("Carrito vacío", "Agrega productos antes de pagar.");
      return;
    }

    /* 1️⃣ Validar stock */
    for (let item of cart) {
      const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.product_id)
        .single();

      if (!product || product.stock < item.quantity) {
        Alert.alert(
          "Stock insuficiente",
          `Solo hay ${product?.stock ?? 0} unidades de "${item.products.name}"`
        );
        return;
      }
    }

    setCheckingOut(true);

    /* 2️⃣ Crear orden */
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert([
        {
          user_id: auth.user.id,
          total: totalAmount,
          status: "pending",
          country: "Colombia",
          locker_type: "fast",
          locker_price: 12.99,
        },
      ])
      .select()
      .single();

    if (orderErr) {
      setCheckingOut(false);
      console.log("❌ Error creando orden:", orderErr);
      return;
    }

    /* 3️⃣ Insertar order_items con detalles del producto */
    const orderItems = cart.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.unit_price * item.quantity,

      // 🆕 campos de detalle sacados de products
      product_name: item.products.name,
      product_image: item.products.image_url,
      product_description: item.products.description ?? null,
    }));

    const { error: orderItemsErr } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (orderItemsErr) {
      console.log("❌ Error insertando order_items:", orderItemsErr);
    }

    /* 4️⃣ Registrar purchase_history */
    const purchaseRows = cart.map((item) => ({
      user_id: auth.user.id,
      product_id: item.product_id,
      paid_price: item.unit_price,
      country: order.country,
      locker_type: order.locker_type,
      locker_price: order.locker_price,
      total: item.unit_price * item.quantity,
    }));

    await supabase.from("purchase_history").insert(purchaseRows);

    /* 5️⃣ Actualizar stock */
    for (let item of cart) {
      await supabase
        .from("products")
        .update({ stock: item.products.stock - item.quantity })
        .eq("id", item.product_id);
    }

    /* 6️⃣ Vaciar carrito */
    await supabase.from("cart_items").delete().eq("user_id", auth.user.id);

    setCheckingOut(false);
    Alert.alert("Éxito", "Tu orden fue creada correctamente.");

    loadCart();
  };

  /* ======================================================
      UI
  ====================================================== */

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#1D6FB5" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.headerSubtitle}>
          {itemsCount === 1 ? "1 item" : `${itemsCount} items`} in your cart
        </Text>
      </View>

      {/* CONTENIDO */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1D6FB5"
          />
        }
      >
        {/* TOTAL */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryAmount}>${formatPrice(totalAmount)}</Text>
        </View>

        {/* ITEMS */}
        {cart.map((item) => {
          const totalLine = item.unit_price * item.quantity;

          return (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.products?.image_url }} style={styles.image} />

              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.products?.name}</Text>
                <Text style={styles.itemPrice}>${formatPrice(totalLine)}</Text>

                {/* CONTROLES */}
                <View style={styles.qtyRow}>
                  {/* BOTÓN − */}
                  <TouchableOpacity
                    style={[
                      styles.qtyButton,
                      item.quantity <= 1 && { opacity: 0.4 },
                    ]}
                    disabled={item.quantity <= 1}
                    onPress={() => handleChangeQuantity(item.id, -1)}
                  >
                    <Text style={styles.qtyButtonText}>−</Text>
                  </TouchableOpacity>

                  <View style={styles.qtyValueBox}>
                    <Text style={styles.qtyValueText}>{item.quantity}</Text>
                  </View>

                  {/* BOTÓN + */}
                  <TouchableOpacity
                    style={[
                      styles.qtyButton,
                      item.products.stock &&
                        item.quantity >= item.products.stock && { opacity: 0.4 },
                    ]}
                    disabled={
                      item.products.stock &&
                      item.quantity >= item.products.stock
                    }
                    onPress={() => handleChangeQuantity(item.id, +1)}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                  <Text style={{ color: "red", marginTop: 4 }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* CHECKOUT */}
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          disabled={checkingOut}
        >
          <Ionicons name="card-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.checkoutText}>
            {checkingOut ? "Processing..." : "Proceed to checkout"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;

/* ======================================================
      ESTILOS
====================================================== */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E5ECFF" },

  header: {
    backgroundColor: "#1D6FB5",
    padding: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: { color: "#DBEAFE", marginTop: 4 },

  content: { flex: 1 },

  summaryCard: {
    backgroundColor: "#1D4ED8",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryLabel: { color: "#DBEAFE" },
  summaryAmount: {
    fontSize: 22,
    color: "#EFF6FF",
    fontWeight: "800",
  },

  itemCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    marginRight: 12,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: "600" },
  itemPrice: { fontSize: 16, fontWeight: "800", marginTop: 4 },

  qtyRow: { flexDirection: "row", marginTop: 6 },
  qtyButton: {
    borderWidth: 1,
    borderColor: "#1D4ED8",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyButtonText: {
    color: "#1D4ED8",
    fontSize: 16,
    fontWeight: "600",
  },
  qtyValueBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  qtyValueText: { fontWeight: "600" },

  checkoutButton: {
    marginTop: 16,
    backgroundColor: "#1D4ED8",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  checkoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});