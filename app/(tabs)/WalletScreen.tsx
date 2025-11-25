import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../../lib/supabaseClient";

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        total,
        country,
        locker_type,
        locker_price,
        status,
        order_items (
          quantity,
          unit_price,
          subtotal,
          product_name,
          product_image
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.log("❌ Error cargando órdenes:", error);

    setOrders(data || []);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FCD34D"; // yellow
      case "shipped":
        return "#60A5FA"; // blue
      case "delivered":
        return "#4ADE80"; // green
      case "cancelled":
        return "#F87171"; // red
      default:
        return "#D1D5DB";
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#1D6FB5" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.headerSubtitle}>Your recent purchases appear here</Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {orders.length === 0 && (
          <Text style={styles.emptyText}>You have no orders yet 🛒</Text>
        )}

        {/* ORDER CARDS */}
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            
            {/* TOP SECTION */}
            <View style={styles.orderHeaderRow}>
              <View>
                <Text style={styles.orderId}>Order #{order.id.slice(0, 6)}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) },
                ]}
              >
                <Text style={styles.statusBadgeText}>{order.status}</Text>
              </View>
            </View>

            {/* PRICE */}
            <Text style={styles.orderTotal}>Total: ${order.total.toFixed(2)}</Text>

            {/* COUNTRY & LOCKER */}
            <View style={styles.infoRow}>
              <Ionicons name="earth-outline" size={16} color="#1D4ED8" />
              <Text style={styles.infoText}>{order.country}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="cube-outline" size={16} color="#1D4ED8" />
              <Text style={styles.infoText}>
                Locker: {order.locker_type} (${order.locker_price})
              </Text>
            </View>

            <View style={styles.divider} />

            {/* ITEMS */}
            <Text style={styles.itemsTitle}>Items</Text>

            {order.order_items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Image
                  source={{ uri: item.product_image }}
                  style={styles.itemImage}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.product_name}</Text>
                  <Text style={styles.itemQty}>
                    {item.quantity} × ${item.unit_price}
                  </Text>
                  <Text style={styles.itemSubtotal}>Subtotal: ${item.subtotal.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;

/* ======================================================
      STYLES
====================================================== */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E5ECFF" },

  header: {
    backgroundColor: "#1D6FB5",
    paddingVertical: 26,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "white",
  },
  headerSubtitle: {
    color: "#DCEAFE",
    marginTop: 4,
    fontSize: 13,
  },

  emptyText: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
  },

  orderCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  orderHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderId: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  orderDate: { fontSize: 13, color: "#6B7280", marginTop: 2 },

  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  statusBadgeText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "capitalize",
  },

  orderTotal: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "800",
    color: "#1D4ED8",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#374151",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },

  itemsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
  },
  itemQty: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  itemSubtotal: {
    fontSize: 13,
    color: "#1D4ED8",
    marginTop: 2,
    fontWeight: "700",
  },
});