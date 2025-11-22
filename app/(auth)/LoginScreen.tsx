import React, { useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import SegmentedAuth from "../../src/components/SegmentedAuth";
import IconInput from "../../src/components/IconInput";
import { BLUE, MUTED, TEXT } from "../../src/theme/colors";
import { supabase } from "../../lib/supabaseClient";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        Alert.alert("Login Error", error.message);
        return;
      }

      if (data.session) {
        router.replace("/(tabs)/home");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.appTitle}>GlobalLocker</Text>
          <Text style={styles.headerTitle}>Welcome back</Text>
          <Text style={styles.headerSubtitle}>
            Log in to continue shopping safely
          </Text>
        </View>

        <View style={styles.card}>
          <SegmentedAuth
            active="login"
            onLeft={() => {}}
            onRight={() => router.push("/(auth)/register")}
          />

          <IconInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
          />
          <IconInput
            placeholder="Enter your password"
            value={pass}
            onChangeText={setPass}
            secure
          />

          <View style={styles.row}>
            <Pressable
              onPress={() => setRemember((v) => !v)}
              style={styles.remember}
              disabled={loading}
            >
              <View style={[styles.checkbox, remember && styles.checkboxOn]}>
                {remember && (
                  <MaterialIcons name="check" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>

            <Pressable disabled={loading}>
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Log in</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/register")} disabled={loading}>
              <Text style={[styles.link, { fontWeight: "700" }]}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#E5ECFF",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: BLUE ?? "#1D6FB5",
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  appTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DBEAFE",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    marginTop: 4,
    color: "#DBEAFE",
    fontSize: 13,
  },
  card: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remember: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9AA2AE",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxOn: {
    backgroundColor: BLUE ?? "#1D6FB5",
    borderColor: BLUE ?? "#1D6FB5",
  },
  rememberText: {
    color: "#2F3C4B",
    fontSize: 13,
  },
  link: {
    color: BLUE ?? "#1D6FB5",
    fontWeight: "600",
    fontSize: 13,
  },
  primaryBtn: {
    marginTop: 4,
    backgroundColor: BLUE ?? "#1D6FB5",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  footerText: {
    color: MUTED,
    fontSize: 13,
  },
  title: { fontSize: 22, fontWeight: "700", color: TEXT },
  subtitle: { color: MUTED, marginBottom: 4 },
});