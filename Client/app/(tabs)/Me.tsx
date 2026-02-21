import { useAuth } from "@/context/authContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { apiClient } from "@/constants/apiClient";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { colors } = useThemeColors("sage");

  const [profile, setProfile] = useState<any>(null);
  const [savedJobs, setSavedJobs] = useState<number>(0);
  const [applications, setApplications] = useState<number>(0);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user?._id) return;

   const fetchData = async () => {
  try {
  
    const [{ data: profileData }, { data: savedData }, { data: appsData }] = await Promise.all([
      apiClient.get(`/profile/${user._id}`),
      apiClient.get(`/profile/${user._id}/saved-jobs/count`),
      apiClient.get(`/profile/${user._id}/applications/count`),
    ]);

    setProfile(profileData);
    setSavedJobs(savedData.count);
    setApplications(appsData.count);

  } catch (err) {
    console.error("Error fetching profile data:", err);
  } finally {
    setLoading(false);
  }
};

    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.replace("/Auth/login");
  };

  const menuItems = [
  
    { icon: "bookmark-outline", name: "Saved Items" },
    { icon: "help-circle-outline", name: "Help Center" },
    { icon: "information-circle-outline", name: "About Vukani" },
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  // format "Joined" date
  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Ionicons
              name="person"
              size={60}
              color={colors.placeholder}
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {profile?.name ?? "Unknown User"}
            </Text>
           
            <Text
              style={{ color: colors.placeholder, marginTop: 4 }}
            >
              {profile?.email ?? ""}
            </Text>
            {joinedDate && (
              <Text
                style={{ color: colors.placeholder, marginTop: 2 }}
              >
                Joined {joinedDate}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.editButton, { borderColor: colors.tint }]}
              onPress={() => console.log("Edit Profile")}
            >
              <Text style={[styles.editButtonText, { color: colors.tint }]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View
          style={[
            styles.statsContainer,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {savedJobs}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.placeholder }]}
            >
              Saved Jobs
            </Text>
          </View>

          <View
            style={[
              styles.statSeparator,
              { backgroundColor: colors.separator },
            ]}
          />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {applications}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.placeholder }]}
            >
              Applications
            </Text>
          </View>
        </View>

        {/* Profile Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => console.log(`Navigating to ${item.name}`)}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={colors.placeholder}
              />
              <Text style={[styles.menuText, { color: colors.text }]}>
                {item.name}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.placeholder}
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.cardBackground },
          ]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={colors.placeholder}
          />
          <Text
            style={[styles.logoutText, { color: colors.placeholder }]}
          >
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 24,
    paddingBottom: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statSeparator: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
  },
  menuContainer: {
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
});
