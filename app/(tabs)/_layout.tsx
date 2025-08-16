import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#2563eb', // Modern blue accent
          tabBarInactiveTintColor: '#94a3b8', // Softer inactive color
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tabs.Screen
          name="Index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={22} color={color} />
            ),
          }}
        />
    
        <Tabs.Screen
          name="Jobs"
          options={{
            title: 'Saved',
            tabBarIcon: ({ color }) => (
              <Ionicons name="briefcase" size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="Messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubble-ellipses" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="Me"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person" size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040505ff', // Light background for modern look
  },
  tabBar: {
    backgroundColor: '#ffffff',
    height: Platform.OS === 'ios' ? 80 : 68,
    paddingBottom: 0,
    borderTopWidth: 0,
    elevation: 1, // Softer Android shadow
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
    marginBottom: Platform.OS === 'ios' ? 16 : 6,
  },
  tabItem: {
    paddingVertical: 6,
    borderRadius: 12,
    margin: 6,
    marginBottom: Platform.OS === 'ios' ? 12 : 8,
  },
});