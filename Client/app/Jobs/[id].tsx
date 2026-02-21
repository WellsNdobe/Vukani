// app/Jobs/[id].tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "@/constants/apiClient";
import { useThemeColors } from "../../hooks/useThemeColor";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import { useSavedJobs } from "@/hooks/useSavedJobs";

export default function JobDetails() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const jobId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { colors } = useThemeColors("sage");
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { savedJobs, toggleJob, fetchSavedJobs } = useSavedJobs(user?._id);

  const isSaved = useMemo(() => {
    if (!jobId) return false;
    return savedJobs.some(
      (savedJob) =>
        (typeof savedJob.jobId === "string" ? savedJob.jobId : savedJob.jobId?._id) === jobId
    );
  }, [savedJobs, jobId]);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        const { data } = await apiClient.get(`/jobs/${jobId}`);
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

  useEffect(() => {
    if (!user?._id) return;
    fetchSavedJobs();
  }, [user?._id, fetchSavedJobs]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text>Job not found</Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.tint }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSaveJob = async () => {
    if (!user?._id || !jobId) {
      Alert.alert("Login required", "Log in to save jobs.");
      return;
    }

    await toggleJob(jobId, isSaved);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
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

      <View style={styles.jobHeader}>
        <View style={[styles.logoPlaceholder, { backgroundColor: colors.divider }]}>
          <MaterialIcons name="business-center" size={32} color={colors.tint} />
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{job.jobTitle}</Text>
          <Text style={[styles.category, { color: colors.icon }]}>{job.jobCategory}</Text>

          <View style={styles.jobDetails}>
            {job.location && (
              <View style={[styles.detailItem, { backgroundColor: colors.divider }]}>
                <Ionicons name="location-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>{job.location}</Text>
              </View>
            )}

            {job.salary && (
              <View style={[styles.detailItem, { backgroundColor: colors.divider }]}>
                <Ionicons name="cash-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>{job.salary}</Text>
              </View>
            )}

            {job.jobType && (
              <View style={[styles.detailItem, { backgroundColor: colors.divider }]}>
                <Ionicons name="time-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>{job.jobType}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {job.jobImage && job.jobImage !== "https://example.com/job-image.png" ? (
        <Image source={{ uri: job.jobImage }} style={styles.hero} resizeMode="cover" />
      ) : null}

      <View style={[styles.dateContainer, { backgroundColor: colors.divider }]}>
        <Ionicons name="calendar-outline" size={16} color={colors.icon} />
        <Text style={[styles.dateText, { color: colors.icon }]}>Posted on {formatDate(job.timestamp)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Job Description</Text>
        <Text style={[styles.sectionText, { color: colors.text }]}>{job.description}</Text>
      </View>

      <TouchableOpacity
        style={[styles.applyButton, { backgroundColor: colors.tint }]}
        onPress={() => router.push(`/Jobs/${jobId}/apply`)}
      >
        <Text style={styles.applyText}>Apply Now</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.applyIcon} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  jobHeader: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    fontWeight: "500",
  },
  hero: {
    width: "100%",
    height: 200,
    marginBottom: 14,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 6,
  },
  dateText: {
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 26,
    paddingVertical: 14,
    borderRadius: 14,
  },
  applyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  applyIcon: {
    marginLeft: 8,
  },
});
