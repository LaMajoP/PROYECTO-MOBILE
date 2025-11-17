// src/screens/RegisterScreen.tsx

import React, { useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SegmentedAuth from "../components/SegmentedAuth";
import IconInput from "../components/IconInput";
import { BLUE, MUTED, TEXT } from "../theme/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

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
            onLeft={() => navigation.replace("Login")}
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
            style={styles.primaryBtn}
            onPress={() => navigation.replace("Home")}
          >
            <Text style={styles.primaryBtnText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#E5ECFF", // mismo fondo azulado que el login
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
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  // (por si luego quieres usar TEXT/MUTED en otros textos)
  title: { fontSize: 22, fontWeight: "700", color: TEXT },
  subtitle: { color: MUTED, marginBottom: 4 },
});