// components/JobPost.tsx
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
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
  id?: string; // optional, if given card press will navigate to /Jobs/:id
  companyLogo?: string | null;
  jobTitle: string;
  companyName: string;
  location?: string;
  timestamp?: string;
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
    onApply,
    onHide,
    onSave,
  } = props;

  const swipeableRef = useRef<Swipeable | null>(null);
  const router = useRouter();

  // Right action (Save)
  const renderRightActions = (progress: any) => {
    const trans = progress.interpolate ? progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    }) : 0;

    return (
      <Animated.View style={[styles.rightAction, { transform: [{ translateX: trans }] }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            swipeableRef.current?.close();
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
    const trans = progress.interpolate ? progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-80, 0],
    }) : 0;

    return (
      <Animated.View style={[styles.leftAction, { transform: [{ translateX: trans }] }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            swipeableRef.current?.close();
            onHide?.();
            // optional confirmation
          }}
        >
          <Ionicons name="eye-off-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Hide</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Card press: navigate to details if id exists, otherwise run onApply
  const handleCardPress = () => {
    if (id) {
      router.push(`/Jobs/${id}`);
      return;
    }
    onApply?.();
  };

  // Apply button press: stop propagation so card press doesn't fire
  const handleApplyPress = (e: GestureResponderEvent) => {
    // Prevent parent touch handlers (card press)
    e.stopPropagation?.();
    onApply?.();
  };

  return (
    // Note: ideally wrap your whole app in GestureHandlerRootView once (app/_layout.tsx)
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
          style={styles.card}
          activeOpacity={0.95}
          onPress={handleCardPress}
        >
          {/* Header */}
          <View style={styles.header}>
            {companyLogo ? (
              <Image source={{ uri: companyLogo }} style={styles.logo} />
            ) : (
              <View style={styles.logo}>
                <MaterialIcons name="business-center" size={24} color="#3B82F6" />
              </View>
            )}
            <View style={styles.headerText}>
              <Text style={styles.jobTitle}>{jobTitle}</Text>
              <Text style={styles.company}>{companyName}</Text>
            </View>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>

          {/* Location */}
          {location ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text style={styles.location}>{location}</Text>
            </View>
          ) : null}

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>

          {/* Apply Button */}
          <View style={styles.applyContainer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyPress}
              activeOpacity={0.85}
            >
              <Text style={styles.applyText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#F3F4F6",
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  jobTitle: {
    fontWeight: "600",
    fontSize: 17,
    color: "#0F172A",
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: "#64748B",
  },
  timestamp: {
    fontSize: 12,
    color: "#94A3B8",
    alignSelf: "flex-start",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  location: {
    fontSize: 14,
    color: "#475569",
    marginLeft: 6,
  },
  description: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
    marginBottom: 16,
  },
  applyContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  applyButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  applyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  rightAction: {
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
    height: "100%",
  },
  leftAction: {
    backgroundColor: "#EF4444",
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
