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
import { BG, BLUE, MUTED, TEXT } from "../theme/colors";
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
        {/* Logo */}
        <View style={styles.logo} />

        <Text style={styles.title}>¡Welcome!</Text>
        <Text style={styles.subtitle}>Create your account</Text>

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

        {/* Botón */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.replace("Home")}   // 👈 navega a Home
        >
          <Text style={styles.primaryBtnText}>Sign up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 28,
    paddingTop: 24,
    gap: 14,
  },
  logo: {
    alignSelf: "center",
    width: 200,
    height: 70,
    backgroundColor: BLUE,
    borderRadius: 6,
    marginVertical: 24,
  },
  title: { fontSize: 22, fontWeight: "700", color: TEXT },
  subtitle: { color: MUTED, marginBottom: 4 },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: BLUE,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});