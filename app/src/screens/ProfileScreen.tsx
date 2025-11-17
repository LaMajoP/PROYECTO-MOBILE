// src/screens/ProfileScreen.tsx

import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type ProfileOption = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

// SIN settings/help, como pediste
const PROFILE_OPTIONS: ProfileOption[] = [
  { id: "wishlist", title: "Wishlist", icon: "heart-outline" },
  { id: "orders", title: "Order history", icon: "bag-outline" },
  { id: "payments", title: "Payment methods", icon: "card-outline" },
  { id: "password", title: "Change password", icon: "lock-closed-outline" },
  {
    id: "personal-info",
    title: "Change personal information",
    icon: "create-outline",
  },
  { id: "language", title: "Change language", icon: "globe-outline" },
  {
    id: "currency",
    title: "Change currency or country",
    icon: "cash-outline",
  },
];

const ProfileScreen: React.FC = () => {
  const userName = "User Name";
  const userEmail = "user@email.com";

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER azul estilo Wallet */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={{ width: 24 }} />
        </View>
      </View>

      {/* CONTENIDO */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* CARD DE PERFIL (match con tarjeta de saldo del Wallet) */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={40} color="#111827" />
            </View>

            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="pencil" size={14} color="#1D4ED8" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>

            <View style={styles.chipsRow}>
              <View style={styles.memberChip}>
                <Ionicons
                  name="sparkles-outline"
                  size={14}
                  color="#1D4ED8"
                />
                <Text style={styles.memberChipText}>Member</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.editProfileBtn}>
              <Text style={styles.editProfileText}>Edit profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD DE OPCIONES estilo “transactionsCard” */}
        <View style={styles.optionsCard}>
          {PROFILE_OPTIONS.map((opt, index) => (
            <View key={opt.id}>
              <TouchableOpacity style={styles.optionRow}>
                <View style={styles.optionLeft}>
                  <View style={styles.optionIconWrapper}>
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color="#1F2937"
                    />
                  </View>
                  <Text style={styles.optionText}>{opt.title}</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>

              {index < PROFILE_OPTIONS.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

        {/* BOTÓN LOG OUT estilo pill rojo como en diseños modernos */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#B91C1C"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E5ECFF", // mismo tipo de fondo azulado que Wallet
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
  content: {
    flex: 1,
  },

  // CARD PERFIL
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatarSection: {
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  userEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  memberChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  memberChipText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#1D4ED8",
    fontWeight: "500",
  },
  editProfileBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1D4ED8",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  editProfileText: {
    color: "#1D4ED8",
    fontWeight: "600",
    fontSize: 13,
  },

  // CARD OPCIONES
  optionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  optionText: {
    fontSize: 15,
    color: "#111827",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },

  // LOG OUT
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#FEF2F2",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#B91C1C",
  },
});