import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

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
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
        <Text style={styles.headerSubtitle}>All your money in one place</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TARJETA DE SALDO */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTopRow}>
            <View style={styles.balanceIconWrapper}>
              <Ionicons name="wallet-outline" size={24} color="#EFF6FF" />
            </View>
            <Text style={styles.balanceLabel}>Available balance</Text>
          </View>

          <Text style={styles.balanceValue}>${formatAmount(balance)}</Text>

          <View style={styles.balanceFooterRow}>
            <View style={styles.balanceChip}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#BFDBFE" />
              <Text style={styles.balanceChipText}>Protected payments</Text>
            </View>
            <Text style={styles.balanceUpdated}>Updated just now</Text>
          </View>
        </View>

        {/* BOTONES DE ACCIÓN */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButtonPrimary}>
            <Ionicons
              name="add-circle-outline"
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.actionTextPrimary}>Add funds</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButtonSecondary}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={18}
              color="#1D4ED8"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.actionTextSecondary}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE TRANSACCIONES */}
        <Text style={styles.sectionTitle}>Recent activity</Text>

        <View style={styles.transactionsCard}>
          {TRANSACTIONS.map((tx, index) => {
            const isIn = tx.type === "in";
            const sign = isIn ? "+" : "-";
            const amountColor = isIn ? "#16A34A" : "#DC2626";
            const iconName: keyof typeof Ionicons.glyphMap = isIn
              ? "arrow-down-circle-outline"
              : "arrow-up-circle-outline";
            const iconBg = isIn ? "#DCFCE7" : "#FEE2E2";
            const iconColor = isIn ? "#15803D" : "#B91C1C";

            return (
              <View key={tx.id}>
                <View style={styles.txRow}>
                  <View style={styles.txLeft}>
                    <View
                      style={[
                        styles.txIconWrapper,
                        { backgroundColor: iconBg },
                      ]}
                    >
                      <Ionicons name={iconName} size={18} color={iconColor} />
                    </View>

                    <View>
                      <Text style={styles.txTitle}>{tx.title}</Text>
                      <Text style={styles.txDate}>{tx.date}</Text>
                    </View>
                  </View>

                  <Text style={[styles.txAmount, { color: amountColor }]}>
                    {sign}${formatAmount(tx.amount)}
                  </Text>
                </View>

                {index < TRANSACTIONS.length - 1 && (
                  <View style={styles.txDivider} />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E5ECFF", // azul muy clarito
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
    color: "#DBEAFE",
    fontSize: 13,
  },
  content: {
    flex: 1,
  },

  // BALANCE CARD
  balanceCard: {
    backgroundColor: "#1D4ED8",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  balanceTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  balanceIconWrapper: {
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
  balanceLabel: {
    fontSize: 14,
    color: "#DBEAFE",
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#EFF6FF",
    marginBottom: 12,
  },
  balanceFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(219, 234, 254, 0.16)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  balanceChipText: {
    fontSize: 12,
    color: "#BFDBFE",
    marginLeft: 4,
  },
  balanceUpdated: {
    fontSize: 11,
    color: "#BFDBFE",
  },

  // ACTIONS
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: "#1D4ED8",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#1D4ED8",
  },
  actionTextPrimary: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  actionTextSecondary: {
    color: "#1D4ED8",
    fontWeight: "600",
    fontSize: 15,
  },

  // TRANSACTIONS
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  transactionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  txIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
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
  txDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
});