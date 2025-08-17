// app/Jobs/[id].tsx
import jobs from "@/data/jobs";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function JobDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <View style={styles.center}>
        <Text>Job not found</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  // Build a short experience summary: prefer explicit field, otherwise derive from description
  const experienceSummary =
    (job as any).experienceSummary || (job as any).experienceLevel ||
    (job.description ? job.description.split(".")?.[0].slice(0, 220) : null);

  const requirements = (job as any).requirements || (job as any).responsibilities || null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#5c4033" }}>
  <ScrollView style={[styles.container, { backgroundColor: "#fff" }]} contentContainerStyle={{ padding: 16 }}>
    
      <View style={styles.header}>
        {job.companyLogo ? (
          <Image source={{ uri: job.companyLogo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder} />
        )}

        <View style={styles.headerText}>
          <Text style={styles.title}>{job.jobTitle}</Text>
          <Text style={styles.company}>{job.companyName} {job.location ? `• ${job.location}` : ""}</Text>
          {job.salary ? <Text style={styles.salary}>{job.salary}</Text> : null}
        </View>
      </View>

      {job.jobImage ? (
        <Image source={{ uri: job.jobImage }} style={styles.hero} />
      ) : null}

      <View style={{ marginTop: 12 }}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.sectionText}>{experienceSummary || job.description}</Text>
      </View>

      {requirements ? (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {Array.isArray(requirements) ? (
            requirements.map((r: string, i: number) => (
              <Text key={i} style={styles.bullet}>• {r}</Text>
            ))
          ) : (
            <Text style={styles.sectionText}>{requirements}</Text>
          )}
        </View>
      ) : null}

      <View style={{ marginTop: 18 }}>
        <Button
          title="Apply"
          onPress={() => router.push(`/Jobs/${id}/apply`)}
        />
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 72, height: 72, borderRadius: 8, marginRight: 12 },
  logoPlaceholder: { width: 72, height: 72, borderRadius: 8, backgroundColor: '#eee', marginRight: 12 },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700' },
  company: { marginTop: 6, color: '#666' },
  salary: { marginTop: 6, fontWeight: '600' },
  hero: { width: '100%', height: 180, borderRadius: 8, marginTop: 12, resizeMode: 'cover' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  sectionText: { color: '#444', lineHeight: 20 },
  bullet: { marginTop: 6, color: '#444' },
});
