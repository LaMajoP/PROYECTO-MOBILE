// src/screens/ProfileScreen.tsx

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
];

const ProfileScreen: React.FC = () => {
  const userName = "User Name";
  const userEmail = "user@email.com";

  // id de la sección abierta (o null si ninguna)
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const renderSectionContent = (id: string) => {
    switch (id) {
      case "wishlist":
        return (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionText}>
              Here you will see the products you saved for later.
            </Text>
            <View style={styles.tagRow}>
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>Cute Lamp</Text>
              </View>
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>Strawberry Blanket</Text>
              </View>
            </View>
          </View>
        );
      case "orders":
        return (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionText}>
              Recent orders (static data for now):
            </Text>
            <View style={styles.listItemRow}>
              <Text style={styles.listItemTitle}>#GLM-10234</Text>
              <Text style={styles.listItemSubtitle}>Delivered · $27.959</Text>
            </View>
            <View style={styles.listItemRow}>
              <Text style={styles.listItemTitle}>#GLM-09821</Text>
              <Text style={styles.listItemSubtitle}>
                On the way · $19.118
              </Text>
            </View>
          </View>
        );
      case "payments":
        return (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionText}>Default card:</Text>
            <View style={styles.cardRow}>
              <Ionicons name="card-outline" size={18} color="#1F2937" />
              <Text style={styles.cardText}>Visa ···· 1234</Text>
            </View>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Add new card</Text>
            </TouchableOpacity>
          </View>
        );
      case "password":
        return (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionText}>
              Update your password (dummy form):
            </Text>
            <TextInput
              placeholder="Current password"
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              placeholder="New password"
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              placeholder="Confirm new password"
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity style={styles.primarySmallBtn}>
              <Text style={styles.primarySmallBtnText}>Save password</Text>
            </TouchableOpacity>
          </View>
        );
      case "personal-info":
        return (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionText}>Update your personal info:</Text>
            <TextInput
              placeholder="Full name"
              defaultValue={userName}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              defaultValue={userEmail}
              keyboardType="email-address"
              style={styles.input}
            />
            <TouchableOpacity style={styles.primarySmallBtn}>
              <Text style={styles.primarySmallBtnText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        );
      case "language":
        return (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionText}>Choose your language:</Text>
            <View style={styles.chipsRow}>
              <View style={[styles.langChip, styles.langChipActive]}>
                <Text style={styles.langChipTextActive}>English</Text>
              </View>
              <View style={styles.langChip}>
                <Text style={styles.langChipText}>Español</Text>
              </View>
              <View style={styles.langChip}>
                <Text style={styles.langChipText}>Português</Text>
              </View>
            </View>
          </View>
        );
      case "currency":
        return (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionText}>Preferred currency:</Text>
            <View style={styles.chipsRow}>
              <View style={[styles.langChip, styles.langChipActive]}>
                <Text style={styles.langChipTextActive}>USD $</Text>
              </View>
              <View style={styles.langChip}>
                <Text style={styles.langChipText}>COP $</Text>
              </View>
              <View style={styles.langChip}>
                <Text style={styles.langChipText}>MXN $</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

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
        {/* CARD DE PERFIL */}
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

        {/* CARD DE OPCIONES con secciones expandibles */}
        <View style={styles.optionsCard}>
          {PROFILE_OPTIONS.map((opt, index) => {
            const isOpen = openSection === opt.id;
            return (
              <View key={opt.id}>
                <TouchableOpacity
                  style={styles.optionRow}
                  activeOpacity={0.8}
                  onPress={() => toggleSection(opt.id)}
                >
                  <View style={styles.optionLeft}>
                    <View style={styles.optionIconWrapper}>
                      <Ionicons name={opt.icon} size={18} color="#1F2937" />
                    </View>
                    <Text style={styles.optionText}>{opt.title}</Text>
                  </View>

                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>

                {isOpen && renderSectionContent(opt.id)}

                {index < PROFILE_OPTIONS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}
        </View>

        {/* LOG OUT */}
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
    backgroundColor: "#E5ECFF",
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
    marginTop: 6,
  },

  // CONTENIDO EXPANDIDO
  sectionBody: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  sectionText: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: 8,
    backgroundColor: "#F9FAFB",
  },
  primarySmallBtn: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "#1D4ED8",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  primarySmallBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  secondaryBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1D4ED8",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  secondaryBtnText: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "600",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
  },
  tagText: {
    fontSize: 12,
    color: "#1D4ED8",
  },
  listItemRow: {
    marginTop: 4,
  },
  listItemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  listItemSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },

    cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  cardText: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "500",
  },

  langChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 4,
    backgroundColor: "#FFFFFF",
  },
  langChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D4ED8",
  },
  langChipText: {
    fontSize: 12,
    color: "#4B5563",
  },
  langChipTextActive: {
    fontSize: 12,
    color: "#1D4ED8",
    fontWeight: "600",
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