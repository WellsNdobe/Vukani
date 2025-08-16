// app/(tabs)/index.tsx
import Header from "@/components/Header";
import JobPost from "@/components/JobPost";
import jobs from "@/data/jobs";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {jobs.map(job => (
          <JobPost
            key={job.id}
            {...job}
            onApply={() => alert(`Applied to ${job.jobTitle}`)}
            onSave={() => alert(`Saved ${job.jobTitle}`)}
            onHide={() => alert(`Hidden ${job.jobTitle}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
