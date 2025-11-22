import React, { useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import SegmentedAuth from "../../src/components/SegmentedAuth";
import IconInput from "../../src/components/IconInput";
import { BLUE, MUTED, TEXT } from "../../src/theme/colors";
import { supabase } from "../../lib/supabaseClient";

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validaciones
    if (!name || !email || !pass || !confirm) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (pass !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (pass.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Registrar usuario con Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
      });

      if (error) {
        Alert.alert("Sign Up Error", error.message);
        return;
      }

      if (data.user) {
        // Opcionalmente guardar el nombre en la tabla de usuarios
        const { error: profileError } = await supabase
          .from("users")
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: name,
            },
          ]);

        if (profileError) {
          console.warn("Profile creation warning:", profileError);
        }

        Alert.alert(
          "Success",
          "Account created! Please check your email to confirm your account.",
          [
            {
              text: "OK",
              onPress: () => router.push("/(auth)/login"),
            },
          ]
        );
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
        {/* HEADER azul, mismo estilo que Login */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>GlobalLocker</Text>
          <Text style={styles.headerTitle}>Create your account</Text>
          <Text style={styles.headerSubtitle}>
            Sign up to start exploring products worldwide
          </Text>
        </View>

        {/* CARD blanca con el formulario de registro */}
        <View style={styles.card}>
          <SegmentedAuth
            active="register"
            onLeft={() => router.push("/(auth)/login")}
            onRight={() => {}}
          />

          {/* Inputs */}
          <IconInput
            placeholder="Full name"
            value={name}
            onChangeText={setName}
            icon="person-outline"
          />
          <IconInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
          />
          <IconInput
            placeholder="Password"
            value={pass}
            onChangeText={setPass}
            secure
          />
          <IconInput
            placeholder="Confirm password"
            value={confirm}
            onChangeText={setConfirm}
            secure
          />

          {/* Botón de registro */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Sign up</Text>
            )}
          </TouchableOpacity>

          {/* Link a Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              disabled={loading}
            >
              <Text style={[styles.link, { fontWeight: "700" }]}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
  link: {
    color: BLUE ?? "#1D6FB5",
    fontWeight: "600",
    fontSize: 13,
  },
  title: { fontSize: 22, fontWeight: "700", color: TEXT },
  subtitle: { color: MUTED, marginBottom: 4 },
});