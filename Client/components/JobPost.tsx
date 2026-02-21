import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useMemo } from "react";
import { useThemeColors } from "@/hooks/useThemeColor";
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
import { useSavedJobs } from "../hooks/useSavedJobs"; // <-- adjust path if needed

export type JobPostProps = {
  _id: string;
  companyLogo?: string | null;
  jobTitle: string;
  companyName: string;
  location?: string;
  timestamp?: string;
  salary?: string;
  jobType?: string;
  description?: string;
  userId: string; // required for the hook
  onApply?: () => void;
  onHide?: () => void;
};

export default function JobPost(props: JobPostProps) {
  const {
    _id,
    companyLogo,
    jobTitle,
    companyName,
    location,
    timestamp,
    description,
    salary,
    jobType,
    userId,
    onApply,
    onHide,
  } = props;

  const swipeableRef = useRef<Swipeable | null>(null);
  const router = useRouter();

  const { savedJobs, toggleJob } = useSavedJobs(userId);

  const isSaved = useMemo(
    () => savedJobs.some((job) => job.jobId === _id),
    [savedJobs, _id]
  );

  const { colors } = useThemeColors("sage");
  const actionColors = {
    saveAction: colors.success,
    hideAction: colors.destructive,
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
            backgroundColor: actionColors.saveAction,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.actionButton}
          onPress={async () => {
            swipeableRef.current?.close();
            await toggleJob(_id, isSaved);
            Alert.alert(
              isSaved ? "Job Removed" : "Job Saved",
              isSaved
                ? "This job has been removed from your saved items"
                : "This job has been added to your saved items"
            );
          }}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={24}
            color="#fff"
          />
          <Text style={styles.actionText}>{isSaved ? "Unsave" : "Save"}</Text>
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
            backgroundColor: actionColors.hideAction,
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
    if (_id) {
      router.push(`/Jobs/${_id}`);
      return;
    }
    onApply?.();
  };

  const handleApplyPress = (e: GestureResponderEvent) => {
    e.stopPropagation?.();
    if (_id) {
      router.push(`/Jobs/${_id}`);
      return;
    }
    onApply?.();
  };

  const handleSavePress = async (e: GestureResponderEvent) => {
    e.stopPropagation?.();
    await toggleJob(_id, isSaved);
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
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
          activeOpacity={0.95}
          onPress={handleCardPress}
        >
          {/* Header */}
          <View style={styles.header}>
            {companyLogo ? (
              <Image source={{ uri: companyLogo }} style={styles.logo} />
            ) : (
              <View style={[styles.logo, { backgroundColor: colors.divider }]}>
                <MaterialIcons
                  name="business-center"
                  size={24}
                  color={colors.tint}
                />
              </View>
            )}
            <View style={styles.headerText}>
              <Text style={[styles.jobTitle, { color: colors.text }]}>
                {jobTitle}
              </Text>
              <Text style={[styles.company, { color: colors.icon }]}>
                {companyName}
              </Text>
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
              <View style={[styles.detailItem, { backgroundColor: colors.divider }]}>
                <Ionicons name="location-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>
                  {location}
                </Text>
              </View>
            )}

            {salary && (
              <View style={[styles.detailItem, { backgroundColor: colors.divider }]}>
                <Ionicons name="cash-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>
                  {salary}
                </Text>
              </View>
            )}

            {jobType && (
              <View style={[styles.detailItem, { backgroundColor: colors.divider }]}>
                <Ionicons name="time-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>
                  {jobType}
                </Text>
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
  container: {
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  saveIcon: {
    padding: 6,
  },
  headerText: {
    flex: 1,
  },
  jobTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 11,
    fontWeight: "500",
  },
  applyButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  applyText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
    height: "100%",
  },
  leftAction: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
    height: "100%",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: "100%",
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6,
  },
});
