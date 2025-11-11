import React, { useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BORDER, MUTED, TEXT } from "../theme/colors";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: IoniconName;
  secure?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
}

const IconInput: React.FC<Props> = ({
  placeholder,
  value,
  onChangeText,
  icon = "mail-outline",
  secure = false,
  keyboardType = "default",
}) => {
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={MUTED}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={hidden}
      />
      <Pressable
        hitSlop={12}
        onPress={() => secure && setHidden(!hidden)}
        style={styles.icon}
      >
        {secure ? (
          <Ionicons
            name={hidden ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#2F3C4B"
          />
        ) : (
          <Ionicons name={icon} size={20} color="#2F3C4B" />
        )}
      </Pressable>
    </View>
  );
};

export default IconInput;

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: { fontSize: 15, paddingRight: 40, color: TEXT },
  icon: { position: "absolute", right: 14, top: 12 },
});
