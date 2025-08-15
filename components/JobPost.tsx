import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type JobPostProps = {
  companyLogo: string;
  jobTitle: string;
  companyName: string;
  location: string;
  timestamp: string;
  description: string;
  jobImage?: string;
  onApply: () => void;
};

const JobPost = ({
  companyLogo,
  jobTitle,
  companyName,
  location,
  timestamp,
  description,
  jobImage,
  onApply
}: JobPostProps) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: companyLogo }} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <Text style={styles.company}>{companyName} • {location}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>

      {/* Job Image */}
      {jobImage && <Image source={{ uri: jobImage }} style={styles.jobImage} />}

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>

      {/* Apply Button */}
      <TouchableOpacity style={styles.applyButton} onPress={onApply}>
        <Ionicons name="briefcase-outline" size={18} color="#fff" />
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
    marginLeft: 8,
  },
  jobTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  company: {
    fontSize: 13,
    color: "#555",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  jobImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 6,
  },
  applyText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },
});

export default JobPost;
