// components/JobList.tsx
import React from "react";
import { FlatList, View } from "react-native";
import JobCard, { Job } from "./JobCard";

const sampleJobs: Job[] = [
  { id: "1", title: "Frontend Engineer", company: "Acme", location: "Remote", summary: "Build delightful UIs." },
  { id: "2", title: "Backend Engineer", company: "Acme", location: "Cape Town", summary: "Design resilient APIs." },
  { id: "3", title: "Product Designer", company: "Acme", location: "Johannesburg", summary: "Craft delightful experiences." },
];

export default function JobList({ jobs = sampleJobs }: { jobs?: Job[] }) {
  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
