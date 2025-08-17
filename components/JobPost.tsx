// components/JobPost.tsx
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

export type JobPostProps = {
  id?: string;
  companyLogo?: string | null;
  jobTitle: string;
  companyName: string;
  location?: string;
  timestamp?: string;
  salary?: string;
  jobType?: string;
  description?: string;
  onApply?: () => void;
  onHide?: () => void;
  onSave?: () => void;
};

export default function JobPost(props: JobPostProps) {
  const {
    id,
    companyLogo,
    jobTitle,
    companyName,
    location,
    timestamp,
    description,
    salary,
    jobType,
    onApply,
    onHide,
    onSave,
  } = props;

  const swipeableRef = useRef<Swipeable | null>(null);
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  // Nude theme colors
  const colors = {
    background: "#f8ede3",
    cardBackground: "#fff9f0",
    text: "#5c4033",
    tint: "#d4a373",
    icon: "#a67c52",
    placeholder: "#c9ada7",
    border: "#e0d7c9",
    saveAction: "#8a9a5b",
    hideAction: "#b56576",
  };

  // Right action (Save)
  const renderRightActions = (progress: any) => {
    const trans = progress.interpolate
      ? progress.interpolate({
          inputRange: [0, 1],
          outputRange: [80, 0],
        })
      : 0;

    return (
      <Animated.View
        style={[
          styles.rightAction,
          {
            transform: [{ translateX: trans }],
            backgroundColor: colors.saveAction,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            swipeableRef.current?.close();
            setIsSaved(true);
            onSave?.();
            Alert.alert("Job Saved", "This job has been added to your saved items");
          }}
        >
          <Ionicons name="bookmark-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Left action (Hide)
  const renderLeftActions = (progress: any) => {
    const trans = progress.interpolate
      ? progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-80, 0],
        })
      : 0;

    return (
      <Animated.View
        style={[
          styles.leftAction,
          {
            transform: [{ translateX: trans }],
            backgroundColor: colors.hideAction,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            swipeableRef.current?.close();
            onHide?.();
          }}
        >
          <Ionicons name="eye-off-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Hide</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handleCardPress = () => {
    if (id) {
      router.push(`/Jobs/${id}`);
      return;
    }
    onApply?.();
  };

  // Updated: pressing the apply button now navigates to the job details page (/Jobs/[id])
  // This allows you to show requirements on the details page before launching the application flow.
  const handleApplyPress = (e: GestureResponderEvent) => {
    e.stopPropagation?.();
    if (id) {
      router.push(`/Jobs/${id}`);
      return;
    }
    onApply?.();
  };

  const handleSavePress = (e: GestureResponderEvent) => {
    e.stopPropagation?.();
    setIsSaved(!isSaved);
    onSave?.();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Swipeable
        ref={swipeableRef}
        friction={2}
        leftThreshold={40}
        rightThreshold={40}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
      >
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          activeOpacity={0.95}
          onPress={handleCardPress}
        >
          {/* Header */}
          <View style={styles.header}>
            {companyLogo ? (
              <Image source={{ uri: companyLogo }} style={styles.logo} />
            ) : (
              <View style={[styles.logo, { backgroundColor: "#f0e6d8" }]}>
                <MaterialIcons name="business-center" size={24} color={colors.tint} />
              </View>
            )}
            <View style={styles.headerText}>
              <Text style={[styles.jobTitle, { color: colors.text }]}>{jobTitle}</Text>
              <Text style={[styles.company, { color: colors.icon }]}>{companyName}</Text>
            </View>
            <TouchableOpacity onPress={handleSavePress} style={styles.saveIcon}>
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isSaved ? colors.tint : colors.placeholder}
              />
            </TouchableOpacity>
          </View>

          {/* Job Details Row */}
          <View style={styles.detailsRow}>
            {location && (
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>{location}</Text>
              </View>
            )}

            {salary && (
              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>{salary}</Text>
              </View>
            )}

            {jobType && (
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>{jobType}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: colors.text }]} numberOfLines={2}>
            {description}
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            {timestamp && (
              <Text style={[styles.timestamp, { color: colors.placeholder }]}>
                {timestamp}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.tint }]}
              onPress={handleApplyPress}
              activeOpacity={0.85}
            >
              <Text style={styles.applyText}>View details</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 8, paddingVertical: 6 },
  card: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  header: { flexDirection: "row", alignItems: "center" },
  logo: { width: 56, height: 56, borderRadius: 8, marginRight: 12, justifyContent: "center", alignItems: "center" },
  headerText: { flex: 1 },
  jobTitle: { fontSize: 16, fontWeight: "700" },
  company: { marginTop: 4, fontSize: 12 },
  saveIcon: { padding: 8 },
  detailsRow: { flexDirection: "row", marginTop: 10, alignItems: "center" },
  detailItem: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  detailText: { marginLeft: 6, fontSize: 12 },
  description: { marginTop: 10, fontSize: 13 },
  footer: { marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  timestamp: { fontSize: 12 },
  applyButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  applyText: { color: "#fff", fontWeight: "600" },

  // swipe actions
  leftAction: { justifyContent: "center", flex: 1 },
  rightAction: { justifyContent: "center", flex: 1, alignItems: "flex-end" },
  actionButton: { width: 100, height: 56, justifyContent: "center", alignItems: "center" },
  actionText: { color: "#fff", marginTop: 6 },
});
