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
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useAuth } from "../../services/auth";
import { supabase } from "../../lib/supabaseClient";

// Avatar Picker Modal
import AvatarPickerModal from "../../src/components/AvatarPickerModal";

type ProfileOption = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const PROFILE_OPTIONS: ProfileOption[] = [
  { id: "wishlist", title: "Wishlist", icon: "heart-outline" },
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

  // Avatar picker
  const [avatarPicker, setAvatarPicker] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      setLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setProfile({
            full_name: data.full_name,
            email: data.email,
          });
        } else {
          setProfile({
            full_name: user.email?.split("@")[0] ?? null,
            email: user.email ?? null,
          });
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  const userName = profile?.full_name ?? "User Name";
  const userEmail = profile?.email ?? user?.email ?? "user@email.com";

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/(auth)/LoginScreen");
    } catch {
      Alert.alert("Error", "Could not log out.");
    }
  };

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
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            {/* Avatar Button */}
            <TouchableOpacity onPress={() => setAvatarPicker(true)}>
              <View style={styles.avatarCircle}>
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={{ width: 72, height: 72, borderRadius: 999 }}
                  />
                ) : (
                  <Ionicons name="person" size={40} color="#111827" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => setAvatarPicker(true)}
            >
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
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsCard}>
          {PROFILE_OPTIONS.map((opt, index) => {
            const isOpen = openSection === opt.id;

            return (
              <View key={opt.id}>
                <TouchableOpacity
                  style={styles.optionRow}
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

                {isOpen && (
                  <View style={styles.sectionBody}>
                    <Text style={styles.sectionText}>Section content here...</Text>
                  </View>
                )}

                {index < PROFILE_OPTIONS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}
        </View>

        {/* Logout */}
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

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        visible={avatarPicker}
        onClose={() => setAvatarPicker(false)}
        onSelect={(url) => {
          setAvatarUrl(url);
          setAvatarPicker(false);
        }}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

/* ---------- STYLES ---------- */

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

  // Profile card
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
    borderRadius: 100,
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

  // Options card
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

  // Logout
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

  sectionBody: { paddingHorizontal: 16, paddingBottom: 12 },
  sectionText: { color: "#4B5563" },
});