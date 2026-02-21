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
import { apiClient } from "@/constants/apiClient";
import { useAuth } from "@/context/authContext";
import * as DocumentPicker from "expo-document-picker";

export default function ApplyJob() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>(); // jobId
  const jobId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { colors } = useThemeColors("sage");
  const { user } = useAuth();

  const MAX_RESUME_BYTES = 5 * 1024 * 1024;
  const ALLOWED_MIME_TYPES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);

  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(""); // mock URL for now
  const [resumeLabel, setResumeLabel] = useState<string | null>(null);
  const [resumeSizeLabel, setResumeSizeLabel] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const resetResume = () => {
    setResume("");
    setResumeLabel(null);
    setResumeSizeLabel(null);
  };

  const mockUploadResume = async () => {
    if (!jobId) {
      Alert.alert("Missing Job", "Unable to upload a resume without a job ID.");
      return;
    }

    try {
      const pickResult = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (pickResult.canceled) {
        return;
      }

      const file = pickResult.assets?.[0];
      if (!file) {
        Alert.alert("Upload failed", "No file selected.");
        return;
      }

      const fileName = file.name ?? "resume.pdf";
      setResumeLabel(fileName);
      setResumeSizeLabel(typeof file.size === "number" ? `${Math.round(file.size / 1024)} KB` : null);

      if (file.mimeType && !ALLOWED_MIME_TYPES.has(file.mimeType)) {
        Alert.alert("Unsupported file", "Please select a PDF or Word document.");
        setResume("");
        return;
      }

      if (typeof file.size === "number" && file.size > MAX_RESUME_BYTES) {
        Alert.alert("File too large", "Please choose a file under 5 MB.");
        setResume("");
        return;
      }

      setIsUploading(true);

      await new Promise((resolve) => setTimeout(resolve, 900));
      const filename = `resume_${Date.now()}.pdf`;
      const mockUrl = `supabase://resumes/${user?._id ?? "anon"}/${jobId}/${filename}`;
      setResume(mockUrl);
      Alert.alert("Upload complete", "Mock resume uploaded to Supabase storage.");
    } catch (error: any) {
      Alert.alert("Upload failed", error?.message ?? "Unable to upload resume.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleApply = async () => {
    if (!jobId) {
      Alert.alert("Missing Job", "Unable to submit an application without a job ID.");
      return;
    }

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

      await apiClient.post("/applications", {
        jobId,
        coverLetter,
        resume,
      });

      Alert.alert("Success", "Your application has been submitted!");
      router.back(); // Go back to job details
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
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
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.cardBackground
            }
          ]}
          placeholder="Tell us why you're the perfect candidate..."
          placeholderTextColor={colors.placeholder}
          value={coverLetter}
          onChangeText={setCoverLetter}
          multiline
          textAlignVertical="top"
          maxLength={1000}
        />
        
        <Text style={[styles.characterCount, { color: colors.placeholder }]}>
          {coverLetter.length}/1000 characters
        </Text>

        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Resume (mock upload)
        </Text>
        <View style={[styles.uploadRow, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}>
          <View style={styles.uploadInfo}>
            <Text style={[styles.uploadLabel, { color: colors.text }]}>
              {resumeLabel ?? "No resume uploaded"}
            </Text>
            <Text style={[styles.uploadHint, { color: colors.placeholder }]}>
              {resumeSizeLabel ? `${resumeSizeLabel} • ` : ""}Stored in mock Supabase path
            </Text>
          </View>
          <View style={styles.uploadActions}>
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: colors.tint, opacity: isUploading ? 0.7 : 1 }]}
              onPress={mockUploadResume}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.uploadButtonText}>Upload CV</Text>
              )}
            </TouchableOpacity>
            {resumeLabel ? (
              <TouchableOpacity
                style={[styles.removeButton, { borderColor: colors.border }]}
                onPress={resetResume}
                disabled={isUploading}
              >
                <Text style={[styles.removeButtonText, { color: colors.text }]}>Remove</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

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
        
        <Text style={[styles.footerNote, { color: colors.placeholder }]}>
          Your application will be reviewed by our hiring team. 
          We will contact you via email if you are selected for an interview.
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
  uploadRow: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  uploadInfo: {
    flex: 1,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  uploadHint: {
    fontSize: 12,
    marginTop: 4,
  },
  uploadActions: {
    gap: 8,
  },
  uploadButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footerNote: { marginTop: 16, fontSize: 12, textAlign: "center" },
});
