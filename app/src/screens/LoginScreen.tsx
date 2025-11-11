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
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SegmentedAuth from "../components/SegmentedAuth";
import IconInput from "../components/IconInput";
import { BG, BLUE, MUTED, TEXT } from "../theme/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Logo (bloque azul temporal) */}
        <View style={styles.logo} />

        <Text style={styles.title}>¡Welcome Back!</Text>
        <Text style={styles.subtitle}>We are happy to see you again</Text>

        {/* Segmento Login/Register */}
        <SegmentedAuth
          active="login"
          onLeft={() => {}}
          onRight={() => navigation.replace("Register")}
        />

        {/* Inputs */}
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

        {/* Remember me */}
        <View style={styles.row}>
          <Pressable
            onPress={() => setRemember((v) => !v)}
            style={styles.remember}
          >
            <View style={[styles.checkbox, remember && styles.checkboxOn]}>
              {remember && <MaterialIcons name="check" size={16} color="#fff" />}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </Pressable>

          <Pressable>
            <Text style={styles.link}>Forgot password?</Text>
          </Pressable>
        </View>

        {/* Botón principal */}
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Log in</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remember: { flexDirection: "row", alignItems: "center", gap: 8 },
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
  checkboxOn: { backgroundColor: BLUE, borderColor: BLUE },
  rememberText: { color: "#2F3C4B" },
  link: { color: BLUE, fontWeight: "600" },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: BLUE,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
