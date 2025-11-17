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
import { BLUE, MUTED, TEXT } from "../theme/colors";
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
        {/* HEADER azul, consistente con el resto de pantallas */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>GlobalLocker</Text>
          <Text style={styles.headerTitle}>Welcome back</Text>
          <Text style={styles.headerSubtitle}>
            Log in to continue shopping safely
          </Text>
        </View>

        {/* CARD blanca con el formulario */}
        <View style={styles.card}>
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

          {/* Remember me + Forgot password */}
          <View style={styles.row}>
            <Pressable
              onPress={() => setRemember((v) => !v)}
              style={styles.remember}
            >
              <View style={[styles.checkbox, remember && styles.checkboxOn]}>
                {remember && (
                  <MaterialIcons name="check" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>

            <Pressable>
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </View>

          {/* Botón principal */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.replace("Home")}
          >
            <Text style={styles.primaryBtnText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#E5ECFF", // mismo fondo azulado que el resto
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
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  // por si quieres usar TEXT/MUTED del theme
  title: { fontSize: 22, fontWeight: "700", color: TEXT },
  subtitle: { color: MUTED, marginBottom: 4 },
});
