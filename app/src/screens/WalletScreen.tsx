import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WalletScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wallet screen</Text>
    </View>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});