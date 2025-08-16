// app/Jobs/[id].tsx
import jobs from "@/data/jobs";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Button, Image, ScrollView, Text, View } from "react-native";

export default function JobDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Job not found</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{job.jobTitle}</Text>
      <Text style={{ color: "#666", marginTop: 6 }}>{job.companyName} • {job.location}</Text>

      {job.companyLogo ? <Image source={{ uri: job.companyLogo }} style={{ width: 80, height: 80, marginTop: 12 }} /> : null}
      {job.jobImage ? <Image source={{ uri: job.jobImage }} style={{ width: "100%", height: 200, marginTop: 12, borderRadius: 8 }} /> : null}

      <Text style={{ marginTop: 12, lineHeight: 20 }}>{job.description}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Apply (coming soon)" onPress={() => alert("Apply flow coming soon")} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}
