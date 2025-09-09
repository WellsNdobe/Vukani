// components/JobCard.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

export type Job = {
  id: string;
  title: string;
  company?: string;
  location?: string;
  summary?: string;
};

export default function JobCard({ job }: { job: Job }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/Jobs/${job.id}`)}
      style={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: "white",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "600" }}>{job.title}</Text>
      <Text style={{ color: "#666", marginTop: 4 }}>{job.company}</Text>
      {job.location ? <Text style={{ color: "#999", marginTop: 6 }}>{job.location}</Text> : null}
      {job.summary ? <Text numberOfLines={2} style={{ color: "#777", marginTop: 8 }}>{job.summary}</Text> : null}
    </Pressable>
  );
}
