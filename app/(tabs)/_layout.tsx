// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 12,
          borderRadius: 999,
          backgroundColor: "#FFFFFF",
          height: 60,
          paddingTop: 6,
          paddingBottom: 6,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        },
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "HomeScreen") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "HistoryScreen") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "WalletScreen") {
            iconName = focused ? "wallet" : "wallet-outline";
          } else if (route.name === "ProfileScreen") {
            iconName = focused ? "person" : "person-outline";
          }

          const tint = focused ? "#1D4ED8" : "#9CA3AF";

          return (
            <Ionicons
              name={iconName}
              size={22}
              color={tint}
              style={{ marginTop: 2 }}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="HomeScreen" />
      <Tabs.Screen name="HistoryScreen" />
      <Tabs.Screen name="WalletScreen" />
      <Tabs.Screen name="ProfileScreen" />
    </Tabs>
  );
}

