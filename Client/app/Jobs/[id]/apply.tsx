// app/Jobs/[id]/apply.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ApplyJob() {
  const { id } = useLocalSearchParams<{ id: string }>(); // jobId
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const handleApply = async () => {
    try {
      const res = await fetch("http://localhost:5000/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: id,
          applicantName: name,
          applicantEmail: email,
          coverLetter,
        }),
      });

      if (res.ok) {
        Alert.alert("Success", "Your application has been submitted!");
        router.back(); // Go back to job details
      } else {
        const error = await res.json();
        Alert.alert("Error", error.message || "Something went wrong.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Apply for Job</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, styles.coverLetter]}
        placeholder="Cover Letter"
        value={coverLetter}
        onChangeText={setCoverLetter}
        multiline
      />
      <Button title="Submit Application" onPress={handleApply} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  coverLetter: { height: 100, textAlignVertical: "top" },
});
