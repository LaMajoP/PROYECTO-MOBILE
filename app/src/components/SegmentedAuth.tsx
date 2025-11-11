import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { BLUE, BORDER } from "../theme/colors";

interface Props {
  active: "login" | "register";
  onLeft: () => void;
  onRight: () => void;
}

const SegmentedAuth: React.FC<Props> = ({ active, onLeft, onRight }) => {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onLeft}
        style={[styles.btn, active === "login" && styles.active]}
      >
        <Text style={[styles.txt, active === "login" && styles.txtActive]}>
          Log in
        </Text>
      </Pressable>
      <Pressable
        onPress={onRight}
        style={[styles.btn, active === "register" && styles.active]}
      >
        <Text style={[styles.txt, active === "register" && styles.txtActive]}>
          Register
        </Text>
      </Pressable>
    </View>
  );
};

export default SegmentedAuth;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#fff",
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 6,
  },
  btn: { flex: 1, paddingVertical: 10, alignItems: "center" },
  txt: { color: "#2F3C4B", fontWeight: "600" },
  active: { backgroundColor: BLUE },
  txtActive: { color: "#fff" },
});
