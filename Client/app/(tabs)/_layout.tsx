import { useThemeColors } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function TabLayout() {
  const { colors } = useThemeColors("sage");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: colors.icon,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ],
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tabs.Screen
          name="Index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
          }}
        />

        <Tabs.Screen
          name="Saved"
          options={{
            title: "Saved",
            tabBarIcon: ({ color }) => <Ionicons name="briefcase" size={20} color={color} />,
          }}
        />

        <Tabs.Screen
          name="Messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubble-ellipses" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="Me"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <Ionicons name="person" size={22} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    height: Platform.OS === "ios" ? 86 : 70,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    borderTopWidth: 1,
    elevation: 1,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.2,
    marginBottom: Platform.OS === "ios" ? 4 : 2,
  },
  tabItem: {
    paddingVertical: 6,
    borderRadius: 12,
    margin: 6,
  },
});
