import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: number; // positivo siempre
  type: "in" | "out"; // in = entra dinero, out = sale dinero
};

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Deposit from card",
    date: "2025-11-10",
    amount: 120.5,
    type: "in",
  },
  {
    id: "2",
    title: "Order #8345",
    date: "2025-11-11",
    amount: 27.959,
    type: "out",
  },
  {
    id: "3",
    title: "Order #8291",
    date: "2025-11-12",
    amount: 19.118,
    type: "out",
  },
  {
    id: "4",
    title: "Refund",
    date: "2025-11-13",
    amount: 15.0,
    type: "in",
  },
];

const WalletScreen: React.FC = () => {
  // saldo = entradas - salidas
  const balance = useMemo(() => {
    return TRANSACTIONS.reduce((total, tx) => {
      if (tx.type === "in") return total + tx.amount;
      return total - tx.amount;
    }, 0);
  }, []);

  const formatAmount = (value: number) => value.toFixed(3);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER AZUL */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
        <Text style={styles.headerSubtitle}>Available balance</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TARJETA DE SALDO */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current balance</Text>
          <Text style={styles.balanceValue}>${formatAmount(balance)}</Text>
        </View>

        {/* BOTONES DE ACCIÓN */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Add funds</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButtonSecondary}>
            <Text style={styles.actionTextSecondary}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE TRANSACCIONES */}
        <Text style={styles.sectionTitle}>Recent activity</Text>

        {TRANSACTIONS.map((tx) => {
          const sign = tx.type === "in" ? "+" : "-";
          const color = tx.type === "in" ? "#16A34A" : "#DC2626";

          return (
            <View key={tx.id} style={styles.txRow}>
              <View>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>

              <Text style={[styles.txAmount, { color }]}>
                {sign}${formatAmount(tx.amount)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#1D6FB5",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    marginTop: 4,
    color: "#E5E7EB",
    fontSize: 13,
  },
  content: {
    flex: 1,
  },
  balanceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#1D6FB5",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1D6FB5",
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  actionTextSecondary: {
    color: "#1D6FB5",
    fontWeight: "600",
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  txDate: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: "700",
  },
});
