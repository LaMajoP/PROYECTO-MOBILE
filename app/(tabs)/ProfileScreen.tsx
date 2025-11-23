// app/(tabs)/ProfileScreen.tsx

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useAuth } from "../../services/auth";
import { supabase } from "../../lib/supabaseClient";

type ProfileOption = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

/* Opciones del perfil */
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

/* Simplified user profile type */
type UserProfile = {
  full_name?: string | null;
  email?: string | null;
};

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      setLoadingProfile(true);
      try {
        // Usamos single() asumiendo que la fila existe; si no, hacemos fallback al user de auth
        const { data, error } = await supabase
          .from("users")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        if (error) {
          // Si no existe fila o hay error, logueamos y usamos fallback
          console.warn("Profile fetch warning:", error);
          setProfile({
            full_name: user.email?.split("@")[0] ?? null,
            email: user.email ?? null,
          });
          return;
        }

        setProfile({
          full_name: data?.full_name ?? user.email?.split("@")[0] ?? null,
          email: data?.email ?? user.email ?? null,
        });
      } catch (err) {
        console.error("Unexpected profile error:", err);
        setProfile({
          full_name: user.email?.split("@")[0] ?? null,
          email: user.email ?? null,
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const userName = profile?.full_name ?? "User Name";
  const userEmail = profile?.email ?? user?.email ?? "user@email.com";

  const handleLogout = async () => {
  try {
    await supabase.auth.signOut(); 
    router.replace("/(auth)/LoginScreen");
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Could not log out, please try again.");
  }
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

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.sectionText}>
            You are not logged in. Redirecting...
          </Text>
          <TouchableOpacity
            style={styles.primarySmallBtn}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={styles.primarySmallBtnText}>Go to login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ width: 24 }} />
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
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
            {loadingProfile ? (
              <ActivityIndicator />
            ) : (
              <>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userEmail}>{userEmail}</Text>
              </>
            )}

            <View style={styles.chipsRow}>
              <View style={styles.memberChip}>
                <Ionicons name="sparkles-outline" size={14} color="#1D4ED8" />
                <Text style={styles.memberChipText}>Member</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.editProfileBtn}>
              <Text style={styles.editProfileText}>Edit profile</Text>
            </TouchableOpacity>
          </View>
        </View>

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

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  avatarSection: {
    position: "relative",
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  editAvatarButton: {
    position: "absolute",
    right: -6,
    bottom: -6,
    backgroundColor: "#fff",
    borderRadius: 999,
    padding: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  userEmail: {
    color: "#6B7280",
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  memberChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
  },
  memberChipText: {
    color: "#1D4ED8",
    fontWeight: "600",
  },
  editProfileBtn: {
    marginTop: 8,
  },
  editProfileText: {
    color: "#1D4ED8",
    fontWeight: "700",
  },

  optionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 15,
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },

  sectionBody: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionText: {
    color: "#4B5563",
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  tagPill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    color: "#1D4ED8",
  },
  listItemRow: {
    marginTop: 8,
  },
  listItemTitle: {
    fontWeight: "700",
  },
  listItemSubtitle: {
    color: "#6B7280",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  cardText: {
    fontSize: 14,
  },
  secondaryBtn: {
    marginTop: 8,
  },
  secondaryBtnText: {
    color: "#1D4ED8",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  primarySmallBtn: {
    marginTop: 12,
    backgroundColor: "#1D6FB5",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  primarySmallBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  // language / currency chips
  chipsRowSmall: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  langChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D4ED8",
  },
  langChipText: {
    color: "#374151",
  },
  langChipTextActive: {
    color: "#1D4ED8",
    fontWeight: "700",
  },

  logoutButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  logoutText: {
    color: "#B91C1C",
    fontWeight: "700",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
