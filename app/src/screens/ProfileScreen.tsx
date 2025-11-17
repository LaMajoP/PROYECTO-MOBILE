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
  { id: "settings", title: "Settings", icon: "settings-outline" },
  { id: "help", title: "Help", icon: "help-circle-outline" },
];

const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER AZUL */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          {/* espacio fantasma para centrar el título */}
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* AVATAR + NOMBRE */}
        <View style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              {/* Avatar simple: ícono de usuario */}
              <Ionicons name="person" size={52} color="#111827" />
            </View>

            <View style={styles.editIconWrapper}>
              <Ionicons name="pencil" size={16} color="#111827" />
            </View>
          </View>

          <Text style={styles.userName}>User Name</Text>
        </View>

        {/* OPCIONES */}
        <View style={styles.optionsContainer}>
          {PROFILE_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.id} style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name={opt.icon} size={22} color="#111827" />
                <Text style={styles.optionText}>{opt.title}</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* LOG OUT */}
        <TouchableOpacity style={styles.logoutRow}>
          <View style={styles.optionLeft}>
            <Ionicons
              name="log-out-outline"
              size={22}
              color="#B91C1C"
            />
            <Text style={styles.logoutText}>Log out</Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#B91C1C"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#1D6FB5",
    paddingHorizontal: 16,
    paddingTop: 12,
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
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    marginRight: 16,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  editIconWrapper: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  optionsContainer: {
    backgroundColor: "#F3F4F6",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    fontSize: 15,
    color: "#111827",
  },
  logoutRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#B91C1C",
  },
});