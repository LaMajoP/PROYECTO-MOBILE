// src/screens/HistoryScreen.tsx

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

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

  // número total de ítems (sumando cantidades)
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtitle = itemsCount === 1 ? "1 item" : `${itemsCount} items`;

  const handleChangeQuantity = (id: string, delta: 1 | -1) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(1, item.quantity + delta); // mínimo 1
        return { ...item, quantity: newQty };
      })
    );
  };

  const formatPrice = (value: number) => {
    // 19.118, 27.959, etc.
    return value.toFixed(3);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER AZUL */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Shopping Cart</Text>

          {/* Espacio para centrar el título */}
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>

      {/* CONTENIDO */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {cart.map((item) => {
          const totalPrice = item.unitPrice * item.quantity;

          return (
            <View key={item.id} style={styles.itemRow}>
              {/* Imagen del producto (placeholder) */}
              <View style={styles.imagePlaceholder} />

              {/* Info del producto */}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>

                {/* Precio total = unitPrice x quantity */}
                <Text style={styles.itemPrice}>${formatPrice(totalPrice)}</Text>

                {/* Controles de cantidad */}
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBox}
                    onPress={() => handleChangeQuantity(item.id, -1)}
                  >
                    <Text style={styles.qtyText}>−</Text>
                  </TouchableOpacity>

                  <View style={styles.qtyBox}>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.qtyBox}
                    onPress={() => handleChangeQuantity(item.id, +1)}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Precio unitario pequeño (opcional) */}
                <Text style={styles.unitPriceText}>
                  Unit price: ${formatPrice(item.unitPrice)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#1D6FB5",
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTopRow: {
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
  backArrow: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    marginTop: 4,
    textAlign: "center",
    color: "#E5E7EB",
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  itemRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBox: {
    borderWidth: 1,
    borderColor: "#111827",
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 4,
  },
  qtyText: {
    fontSize: 16,
  },
  unitPriceText: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 12,
  },
});