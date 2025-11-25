import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useAuth } from "../../services/auth";
import { supabase } from "../../lib/supabaseClient";
import { openCamera } from "../../src/utils/useCamera";
import { uploadAvatar } from "../../src/utils/uploadAvatar";

// Modals
import AvatarPickerModal from "../../src/components/AvatarPickerModal";
import AvatarSourceModal from "../../src/components/AvatarSourceModal";
import HelpChatModal from "../../src/components/HelpChatModal";

type ProfileOption = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const PROFILE_OPTIONS: ProfileOption[] = [
  { id: "wishlist", title: "Wishlist", icon: "heart-outline" },
  { id: "payments", title: "Payment methods", icon: "card-outline" },
  { id: "password", title: "Change password", icon: "lock-closed-outline" },
  { id: "personal-info", title: "Change personal information", icon: "create-outline" },
  { id: "language", title: "Change language", icon: "globe-outline" },
  { id: "currency", title: "Change currency or country", icon: "cash-outline" },
];

type UserProfile = {
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [avatarPicker, setAvatarPicker] = useState(false);
  const [avatarSourceVisible, setAvatarSourceVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [helpVisible, setHelpVisible] = useState(false);

  /* ------------------- LOAD PROFILE ------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      setLoadingProfile(true);

      const { data } = await supabase
        .from("users")
        .select("full_name, email, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
      }

      setLoadingProfile(false);
    };

    fetchProfile();
  }, [user]);

  const userName = profile?.full_name ?? "User Name";
  const userEmail = profile?.email ?? user?.email ?? "email@example.com";

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  /* ------------------- CAMERA ------------------- */
  const handleTakePhoto = async () => {
    const uri = await openCamera();
    if (!uri || !user) return;

    const publicUrl = await uploadAvatar(user.id, uri);

    if (!publicUrl) return;

    await supabase.from("users").update({ avatar_url: publicUrl }).eq("id", user.id);

    setAvatarUrl(publicUrl);
    setAvatarSourceVisible(false);
  };

  const handlePickAvatar = () => {
    setAvatarSourceVisible(false);
    setAvatarPicker(true);
  };

  /* ------------------- LOGOUT ------------------- */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/LoginScreen");
  };

  /* ------------------- UI ------------------- */
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ width: 24 }} />
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16 }}>
        
        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={() => setAvatarSourceVisible(true)}>
              <View style={styles.avatarCircle}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
                ) : (
                  <Ionicons name="person" size={40} color="#111827" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editAvatarButton} onPress={() => setAvatarSourceVisible(true)}>
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

        {/* OPTIONS LIST */}
        <View style={styles.optionsCard}>
          {PROFILE_OPTIONS.map((opt, index) => {
            const isOpen = openSection === opt.id;

            return (
              <View key={opt.id}>
                <TouchableOpacity style={styles.optionRow} onPress={() => toggleSection(opt.id)}>
                  <View style={styles.optionLeft}>
                    <View style={styles.optionIconWrapper}>
                      <Ionicons name={opt.icon} size={18} color="#1F2937" />
                    </View>
                    <Text style={styles.optionText}>{opt.title}</Text>
                  </View>

                  <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.sectionBody}>
                    <Text style={styles.sectionText}>Section content here...</Text>
                  </View>
                )}

                {index < PROFILE_OPTIONS.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>

        {/* HELP */}
        <TouchableOpacity style={styles.helpRow} onPress={() => setHelpVisible(true)}>
          <View style={styles.optionLeft}>
            <View style={styles.optionIconWrapper}>
              <Ionicons name="information-circle-outline" size={18} color="#1F2937" />
            </View>
            <Text style={styles.optionText}>Help & Support</Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#B91C1C" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODALS */}
      <AvatarSourceModal
        visible={avatarSourceVisible}
        onClose={() => setAvatarSourceVisible(false)}
        onTakePhoto={handleTakePhoto}
        onPickAvatar={handlePickAvatar}
      />

      <AvatarPickerModal
        visible={avatarPicker}
        onClose={() => setAvatarPicker(false)}
        onSelect={async (url) => {
          if (!user) return;

          await supabase.from("users").update({ avatar_url: url }).eq("id", user.id);
          setAvatarUrl(url);
          setAvatarPicker(false);
        }}
      />

      <HelpChatModal visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

/* ---------------------- ESTILOS ---------------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E5ECFF" },

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

  headerTitle: { fontSize: 22, fontWeight: "800", color: "#FFFFFF" },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  avatarSection: { position: "relative" },

  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    overflow: "hidden",        // 🔥 IMPORTANTE (recorta la imagen)
    alignItems: "center",
    justifyContent: "center",
  },

  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 999,
    position: "absolute",       // 🔥 PARA QUE NO QUEDE DETRÁS DEL CÍRCULO
    top: 0,
    left: 0,
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

  profileInfo: { flex: 1 },

  userName: { fontSize: 16, fontWeight: "700", color: "#111827" },
  userEmail: { color: "#6B7280", marginTop: 4 },

  chipsRow: { flexDirection: "row", marginTop: 8 },
  memberChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
  },
  memberChipText: { color: "#1D4ED8", fontWeight: "600" },

  optionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 16,
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  optionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },

  optionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  optionText: { fontSize: 15, color: "#111827" },

  sectionBody: { paddingHorizontal: 16, paddingBottom: 12 },
  sectionText: { color: "#4B5563" },

  divider: { height: 1, backgroundColor: "#F3F4F6" },

  helpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },

  logoutButton: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
  },

  logoutText: { color: "#B91C1C", fontWeight: "700" },
});