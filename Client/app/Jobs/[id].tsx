// app/Jobs/[id].tsx
import { ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { useThemeColors } from "../../hooks/useThemeColor";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function JobDetails() {
  const { id: jobId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useThemeColors("nude");
  const [isSaved, setIsSaved] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Complementary colors for the nude theme
  const complementaryColors = {
    cardBackground: "#f8f4f0", // Very light cream
    border: "#e0d7c9",        // Light clay border
    placeholder: "#8c6b5a",   // Muted brown
    buttonPressed: "#b38a63", // Darker clay
  };

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/jobs/${jobId}`);
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
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.tint }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? "Job Unsaved" : "Job Saved",
      isSaved ? "Removed from saved jobs" : "Added to your saved jobs"
    );
  };

  // Format the timestamp to a readable date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
        <View
          style={[
            styles.logoPlaceholder,
            { backgroundColor: complementaryColors.cardBackground },
          ]}
        >
          <MaterialIcons name="business-center" size={32} color={colors.tint} />
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{job.jobTitle}</Text>
          <Text style={[styles.category, { color: colors.icon }]}>{job.jobCategory}</Text>

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

      {/* Job Image */}
      {job.jobImage && job.jobImage !== "https://example.com/job-image.png" ? (
        <Image 
          source={{ uri: job.jobImage }} 
          style={styles.hero} 
          resizeMode="cover"
        />
      ) : null}

      {/* Posted Date */}
      <View style={[styles.dateContainer, { backgroundColor: complementaryColors.cardBackground }]}>
        <Ionicons name="calendar-outline" size={16} color={colors.icon} />
        <Text style={[styles.dateText, { color: colors.icon }]}>
          Posted on {formatDate(job.timestamp)}
        </Text>
      </View>

      {/* Job Description */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Job Description</Text>
        <Text style={[styles.sectionText, { color: colors.text }]}>
          {job.description}
        </Text>
      </View>

      {/* Apply Button */}
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
    backgroundColor: '#fff' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
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
  jobHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logoPlaceholder: { 
    width: 80, 
    height: 80, 
    borderRadius: 16, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: { 
    flex: 1,
    justifyContent: 'center',
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700',
    marginBottom: 4,
  },
  category: { 
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500',
  },
  hero: { 
    width: '100%', 
    height: 200, 
    marginTop: 8,
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    marginBottom: 12,
  },
  sectionText: { 
    fontSize: 15,
    lineHeight: 22,
  },
  applyButton: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 40,
    marginTop: 16,
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  applyIcon: {
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});