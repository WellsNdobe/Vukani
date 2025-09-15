// app/Jobs/[id].tsx
import { ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const complementaryColors = {
  cardBackground: "#f8f4f0", // Very light cream
  border: "#e0d7c9",        // Light clay border
  placeholder: "#8c6b5a",   // Muted brown
  buttonPressed: "#b38a63", // Darker clay
};

export default function JobDetails() {
  // expo-router gives `id` from the route, which will be the job's `_id`
  const { id: jobId } = useLocalSearchParams<{ id: string }>();
  console.log("Job ID from params:", jobId);
  const router = useRouter();
  const { colors } = useThemeColors("nude");
  const [isSaved, setIsSaved] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/jobs/${jobId}`); // use jobId instead of id
        if (!res.ok) throw new Error("Failed to fetch job");
        const data = await res.json();
        setJob(data);
      } catch (error: any) {
        console.error(error);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: "#fff" }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={[styles.center, { backgroundColor: "#fff" }]}>
        <Text>Job not found</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  const experienceSummary =
    job.experienceSummary ||
    job.experienceLevel ||
    (job.description ? job.description.split(".")?.[0].slice(0, 220) : null);

  const requirements = job.requirements || job.responsibilities || null;
  const benefits = job.benefits || null;

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? "Job Unsaved" : "Job Saved",
      isSaved ? "Removed from saved jobs" : "Added to your saved jobs"
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: "#fff" }]}>
      {/* Header with back button and save */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSaveJob} style={styles.saveButton}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={24}
            color={isSaved ? colors.tint : colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Job Header */}
      <View style={styles.jobHeader}>
        {job.companyLogo ? (
          <Image source={{ uri: job.companyLogo }} style={styles.logo} />
        ) : (
          <View
            style={[
              styles.logoPlaceholder,
              { backgroundColor: complementaryColors.cardBackground },
            ]}
          >
            <MaterialIcons name="business-center" size={32} color={colors.tint} />
          </View>
        )}

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{job.jobTitle}</Text>
          <Text style={[styles.company, { color: colors.icon }]}>{job.companyName}</Text>

          <View style={styles.jobDetails}>
            {job.location && (
              <View
                style={[
                  styles.detailItem,
                  { backgroundColor: complementaryColors.cardBackground },
                ]}
              >
                <Ionicons name="location-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>
                  {job.location}
                </Text>
              </View>
            )}

            {job.salary && (
              <View
                style={[
                  styles.detailItem,
                  { backgroundColor: complementaryColors.cardBackground },
                ]}
              >
                <Ionicons name="cash-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>
                  {job.salary}
                </Text>
              </View>
            )}

            {job.jobType && (
              <View
                style={[
                  styles.detailItem,
                  { backgroundColor: complementaryColors.cardBackground },
                ]}
              >
                <Ionicons name="time-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>
                  {job.jobType}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        style={[styles.applyButton, { backgroundColor: colors.tint }]}
        onPress={() => router.push(`/Jobs/${jobId}/apply`)} // <-- use jobId
      >
        <Text style={styles.applyText}>Apply Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  backButton: { padding: 5 },
  saveButton: { padding: 5 },
  jobHeader: { flexDirection: "row", padding: 10 },
  logo: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerText: { flex: 1 },
  title: { fontSize: 18, fontWeight: "bold" },
  company: { fontSize: 14, marginTop: 2 },
  jobDetails: { flexDirection: "row", gap: 10, marginTop: 8 },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  detailText: { marginLeft: 4 },
  applyButton: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  applyText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
