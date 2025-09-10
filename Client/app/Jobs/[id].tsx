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
  View
} from "react-native";

const complementaryColors = {
    cardBackground: "#f8f4f0", // Very light cream
    border: "#e0d7c9",        // Light clay border
    placeholder: "#8c6b5a",   // Muted brown
    buttonPressed: "#b38a63", // Darker clay
  };

export default function JobDetails() {
const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useThemeColors("nude");
  const [isSaved, setIsSaved] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/jobs/${id}`); // change URL if backend is hosted
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
  }, [id]);

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
    (job as any).experienceSummary || 
    (job as any).experienceLevel ||
    (job.description ? job.description.split(".")?.[0].slice(0, 220) : null);

  const requirements = (job as any).requirements || (job as any).responsibilities || null;
  const benefits = (job as any).benefits || null;

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    Alert.alert(isSaved ? "Job Unsaved" : "Job Saved", 
      isSaved ? "Removed from saved jobs" : "Added to your saved jobs");
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
          <View style={[styles.logoPlaceholder, { backgroundColor: complementaryColors.cardBackground }]}>
            <MaterialIcons name="business-center" size={32} color={colors.tint} />
          </View>
        )}

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{job.jobTitle}</Text>
          <Text style={[styles.company, { color: colors.icon }]}>{job.companyName}</Text>
          
          <View style={styles.jobDetails}>
            {job.location && (
              <View style={[styles.detailItem, { backgroundColor: complementaryColors.cardBackground }]}>
                <Ionicons name="location-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>{job.location}</Text>
              </View>
            )}
            
            {job.salary && (
              <View style={[styles.detailItem, { backgroundColor: complementaryColors.cardBackground }]}>
                <Ionicons name="cash-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>{job.salary}</Text>
              </View>
            )}
            
            {(job as any).jobType && (
              <View style={[styles.detailItem, { backgroundColor: complementaryColors.cardBackground }]}>
                <Ionicons name="time-outline" size={14} color={colors.icon} />
                <Text style={[styles.detailText, { color: colors.icon }]}>{(job as any).jobType}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      {/* Job Image */}
      {job.jobImage ? (
        <Image 
          source={{ uri: job.jobImage }} 
          style={styles.hero} 
          resizeMode="cover"
        />
      ) : null}
      
      {/* Job Stats */}
      <View style={[styles.statsContainer, { borderColor: complementaryColors.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
          <Text style={[styles.statLabel, { color: complementaryColors.placeholder }]}>Applications</Text>
        </View>
        
        <View style={[styles.statSeparator, { backgroundColor: complementaryColors.border }]} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
          <Text style={[styles.statLabel, { color: complementaryColors.placeholder }]}>Days Left</Text>
        </View>
        
        <View style={[styles.statSeparator, { backgroundColor: complementaryColors.border }]} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>Mid</Text>
          <Text style={[styles.statLabel, { color: complementaryColors.placeholder }]}>Seniority</Text>
        </View>
      </View>
      
      {/* Job Summary */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Job Summary</Text>
        <Text style={[styles.sectionText, { color: colors.text }]}>
          {experienceSummary || job.description}
        </Text>
      </View>
      
      {/* Requirements */}
      {requirements && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Requirements</Text>
          {Array.isArray(requirements) ? (
            requirements.map((r: string, i: number) => (
              <View key={i} style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: colors.tint }]} />
                <Text style={[styles.bulletText, { color: colors.text }]}>{r}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.sectionText, { color: colors.text }]}>{requirements}</Text>
          )}
        </View>
      )}
      
      {/* Benefits */}
      {benefits && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Benefits</Text>
          {Array.isArray(benefits) ? (
            benefits.map((b: string, i: number) => (
              <View key={i} style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.tint} />
                <Text style={[styles.bulletText, { color: colors.text }]}>{b}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.sectionText, { color: colors.text }]}>{benefits}</Text>
          )}
        </View>
      )}
      
      {/* Apply Button */}
      <TouchableOpacity 
        style={[styles.applyButton, { backgroundColor: colors.tint }]}
        onPress={() => router.push(`/Jobs/${id}/apply`)}
      >
        <Text style={styles.applyText}>Apply Now</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  logo: { 
    width: 80, 
    height: 80, 
    borderRadius: 16, 
    marginRight: 16 
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
  company: { 
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
  },
  statsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
  },
  statSeparator: {
    width: 1,
    height: '60%',
    alignSelf: 'center',
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
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  applyButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 40,
    marginTop: 16,
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});