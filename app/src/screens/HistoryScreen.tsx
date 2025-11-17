import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type CartItem = {
  id: string;
  name: string;
  unitPrice: number; // precio unitario
  quantity: number;
};

const INITIAL_CART: CartItem[] = [
  {
    id: "1",
    name: "Cute Lamb Ears Hairband",
    unitPrice: 19.118,
    quantity: 1,
  },
  {
    id: "2",
    name: "Stitch Plush Toy",
    unitPrice: 71.756,
    quantity: 1,
  },
  {
    id: "3",
    name: "Pink Strawberry Bunny",
    unitPrice: 27.959,
    quantity: 2,
  },
];

const HistoryScreen: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);

  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtitle = itemsCount === 1 ? "1 item in your cart" : `${itemsCount} items in your cart`;

  const totalAmount = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const handleChangeQuantity = (id: string, delta: 1 | -1) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(1, item.quantity + delta); // mínimo 1
        return { ...item, quantity: newQty };
      })
    );
  };

  const formatPrice = (value: number) => value.toFixed(3);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER estilo Wallet/Profile */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Shopping Cart</Text>

          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>

      {/* CONTENIDO */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* RESUMEN TOTAL */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <View style={styles.summaryIconWrapper}>
              <Ionicons name="cart-outline" size={22} color="#EFF6FF" />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryHint}>Including all items</Text>
            </View>
          </View>

          <Text style={styles.summaryAmount}>${formatPrice(totalAmount)}</Text>
        </View>

        {/* ITEMS DEL CARRITO */}
        <View style={styles.itemsContainer}>
          {cart.map((item) => {
            const totalPrice = item.unitPrice * item.quantity;

            return (
              <View key={item.id} style={styles.itemCard}>
                {/* Imagen placeholder */}
                <View style={styles.imagePlaceholder} />

                {/* Info del producto */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    ${formatPrice(totalPrice)}
                  </Text>

                  {/* Controles de cantidad */}
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => handleChangeQuantity(item.id, -1)}
                    >
                      <Text style={styles.qtyButtonText}>−</Text>
                    </TouchableOpacity>

                    <View style={styles.qtyValueBox}>
                      <Text style={styles.qtyValueText}>{item.quantity}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => handleChangeQuantity(item.id, +1)}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.unitPriceText}>
                    Unit price: ${formatPrice(item.unitPrice)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* BOTÓN CHECKOUT (visual por ahora) */}
        <TouchableOpacity style={styles.checkoutButton}>
          <Ionicons
            name="card-outline"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.checkoutText}>Proceed to checkout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E5ECFF", // mismo fondo azulado que Wallet/Profile
  },
  header: {
    backgroundColor: "#1D6FB5",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    marginTop: 4,
    color: "#DBEAFE",
    fontSize: 13,
  },
  content: {
    flex: 1,
  },

  // RESUMEN
  summaryCard: {
    backgroundColor: "#1D4ED8",
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "#1E40AF",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#DBEAFE",
    fontWeight: "500",
  },
  summaryHint: {
    fontSize: 12,
    color: "#BFDBFE",
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#EFF6FF",
  },

  // ITEMS
  itemsContainer: {
    gap: 12,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
    marginBottom: 6,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: "#1D4ED8",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#EFF6FF",
  },
  qtyButtonText: {
    fontSize: 16,
    color: "#1D4ED8",
    fontWeight: "600",
  },
  qtyValueBox: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 4,
    backgroundColor: "#FFFFFF",
  },
  qtyValueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  unitPriceText: {
    fontSize: 12,
    color: "#6B7280",
  },

  // CHECKOUT
  checkoutButton: {
    marginTop: 20,
    backgroundColor: "#1D4ED8",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  checkoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});