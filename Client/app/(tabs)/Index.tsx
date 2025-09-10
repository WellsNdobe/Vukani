// app/(tabs)/index.tsx
import Header from "@/components/Header";
import JobPost from "@/components/JobPost";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/jobs"); 
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (error: any) {
        console.error(error);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {jobs.map((job) => (
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
