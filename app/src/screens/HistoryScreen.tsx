import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HistoryScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History screen</Text>
    </View>
  );
};

export default HistoryScreen;

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