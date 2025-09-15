// app/Jobs/[id]/apply.tsx
import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ApplyJob() {
  const { id } = useLocalSearchParams<{ id: string }>(); // jobId
  const router = useRouter();
  const { colors } = useThemeColors("nude");

  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(""); // URL or filename for now
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Complementary colors for the nude theme
  const complementaryColors = {
    inputBorder: "#d4b499",
    placeholder: "#8c6b5a",
    cardBackground: "#f8f4f0",
  };

  const handleApply = async () => {
    if (!coverLetter.trim() && !resume.trim()) {
      Alert.alert("Missing Information", "Please provide at least a cover letter or a resume.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Not Logged In", "Please log in before applying for jobs.");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("http://localhost:5000/applications", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: id,
          coverLetter,
          resume,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: "#fff" }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: colors.text }]}>Apply for Job</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>
      
      {/* Application Form */}
      <View style={styles.formContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Application Details
        </Text>
        
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Cover Letter
        </Text>
        <TextInput
          style={[
            styles.input, 
            styles.coverLetter, 
            { 
              borderColor: complementaryColors.inputBorder,
              color: colors.text,
              backgroundColor: "#fff"
            }
          ]}
          placeholder="Tell us why you're the perfect candidate..."
          placeholderTextColor={complementaryColors.placeholder}
          value={coverLetter}
          onChangeText={setCoverLetter}
          multiline
          textAlignVertical="top"
          maxLength={1000}
        />
        
        <Text style={[styles.characterCount, { color: complementaryColors.placeholder }]}>
          {coverLetter.length}/1000 characters
        </Text>

        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Resume (link or filename)
        </Text>
        <TextInput
          style={[
            styles.input, 
            { 
              borderColor: complementaryColors.inputBorder,
              color: colors.text,
              backgroundColor: "#fff"
            }
          ]}
          placeholder="Paste a link to your resume or upload later"
          placeholderTextColor={complementaryColors.placeholder}
          value={resume}
          onChangeText={setResume}
        />

        <TouchableOpacity
          style={[
            styles.submitButton, 
            { 
              backgroundColor: colors.tint,
              opacity: isSubmitting ? 0.7 : 1
            }
          ]}
          onPress={handleApply}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Application</Text>
          )}
        </TouchableOpacity>
        
        <Text style={[styles.footerNote, { color: complementaryColors.placeholder }]}>
          Your application will be reviewed by our hiring team. 
          We'll contact you via email if you're selected for an interview.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  backButton: { padding: 8 },
  heading: { fontSize: 20, fontWeight: "600" },
  formContainer: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  inputLabel: { fontSize: 14, marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  coverLetter: { height: 120 },
  characterCount: { fontSize: 12, marginTop: 4 },
  submitButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footerNote: { marginTop: 16, fontSize: 12, textAlign: "center" },
});
