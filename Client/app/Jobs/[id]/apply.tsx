// app/Jobs/[id]/apply.tsx
import jobs from "@/data/jobs";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Answers = { [question: string]: string };

export default function JobApply() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const job = jobs.find((j) => j.id === id);

  // Personal / contact
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Resume
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [resumeUri, setResumeUri] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState(""); // fallback: paste URL

  // Cover letter
  const [coverLetter, setCoverLetter] = useState("");

  // Job-specific questions (default set - adjust as needed)
  const defaultQuestions =
    (job as any)?.questions || [
      "Why are you interested in this role?",
      "Briefly describe your most relevant experience.",
      "What would you bring to the team in the first 90 days?",
    ];

  const [answers, setAnswers] = useState<Answers>(() =>
    defaultQuestions.reduce((acc: any, q: any) => ({ ...acc, [q]: "" }), {})
  );

  // UI state
  const [submitting, setSubmitting] = useState(false);

  // Helpers / Validation
  const isEmailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const hasProvidedResume = !!resumeUri || !!resumeUrl.trim();
  const hasAnsweredQuestions = Object.values(answers).some((a) => a.trim().length > 20); // require some substantive answer

  function validate() {
    if (!fullName.trim()) {
      Alert.alert("Validation", "Please enter your full name.");
      return false;
    }
    if (!email.trim() || !isEmailValid(email)) {
      Alert.alert("Validation", "Please enter a valid email address.");
      return false;
    }
    // At least one of resume or substantive question answers or cover letter
    if (!hasProvidedResume && !hasAnsweredQuestions && !coverLetter.trim()) {
      Alert.alert(
        "Validation",
        "Please upload a resume, answer the job questions, or provide a cover letter."
      );
      return false;
    }
    return true;
  }

  async function pickResume() {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
        type: Platform.OS === "ios" ? "public.item" : "*/*",
      });

      // handle both old and new shapes
      if (res.type === "success") {
        setResumeName((res as any).name ?? "resume");
        setResumeUri((res as any).uri ?? null);
        setResumeUrl(""); // clear pasted URL if file chosen
      }
    } catch (err) {
      console.warn("DocumentPicker error", err);
      Alert.alert("Upload error", "Could not pick the file. Try again.");
    }
  }

  async function handleSubmit() {
    if (!validate()) return;

    setSubmitting(true);

    try {
      // Build form payload
      // If you need to upload a file, construct FormData and attach the file blob
      const formData = new FormData();
      formData.append("jobId", id ?? "");
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("coverLetter", coverLetter.trim());
      formData.append("answers", JSON.stringify(answers));

      if (resumeUri) {
        // On Android/Expo, you may need to fetch the file and append a blob. Replace name/mime as appropriate.
        formData.append("resume", {
          uri: resumeUri,
          name: resumeName ?? "resume.pdf",
          type: "application/octet-stream",
        } as any);
      } else if (resumeUrl.trim()) {
        formData.append("resumeUrl", resumeUrl.trim());
      }

      // TODO: replace with your API endpoint
      // Example:
      // await fetch("https://api.yoursite.com/apply", {
      //   method: "POST",
      //   body: formData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      // Simulate network request
      await new Promise((res) => setTimeout(res, 1000));

      Alert.alert("Application sent", "Thank you — your application was submitted.");
      router.back();
    } catch (err) {
      console.error("submit error", err);
      Alert.alert("Submission failed", "Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!job) {
    return (
      <View style={styles.center}>
        <Text>Job not found</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Job header */}
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

      {/* Short requirements summary (if present) */}
      {((job as any).requirements || (job as any).responsibilities) && (
        <View style={{ marginTop: 14 }}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {Array.isArray((job as any).requirements || (job as any).responsibilities) ? (
            ((job as any).requirements || (job as any).responsibilities).map((r: string, i: number) => (
              <Text key={i} style={styles.bullet}>• {r}</Text>
            ))
          ) : (
            <Text style={styles.sectionText}>{(job as any).requirements || (job as any).responsibilities}</Text>
          )}
        </View>
      )}

      {/* Divider */}
      <View style={{ height: 12 }} />

      {/* Apply CTA */}
      <View style={{ marginTop: 8 }}>
        <Button title="Open application form" onPress={() => { /* stay on this page (form below) */ }} />
      </View>

      {/* Application form starts below */}
      <View style={{ height: 16 }} />

      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Application</Text>

      <Text style={{ marginTop: 8, fontWeight: "600" }}>Personal information</Text>
      <TextInput
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Phone (optional)"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
        style={styles.input}
      />

      <Text style={{ marginTop: 12, fontWeight: "600" }}>Resume</Text>
      <TouchableOpacity onPress={pickResume} style={styles.uploadBox}>
        <Text>{resumeName ? `Selected: ${resumeName}` : "Upload resume (PDF/DOC)"}</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 8, marginBottom: 6, color: "#444" }}>Or paste a resume link</Text>
      <TextInput
        placeholder="https://example.com/your-resume.pdf"
        value={resumeUrl}
        onChangeText={(t) => {
          setResumeUrl(t);
          if (t) {
            setResumeName(null);
            setResumeUri(null);
          }
        }}
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={{ marginTop: 12, fontWeight: "600" }}>Cover letter (optional)</Text>
      <TextInput
        placeholder="Write a short cover letter (recommended)"
        value={coverLetter}
        onChangeText={setCoverLetter}
        multiline
        numberOfLines={4}
        style={[styles.input, { minHeight: 100 }]}
      />

      <Text style={{ marginTop: 12, fontWeight: "600" }}>Job questions</Text>
      <Text style={{ color: "#666", marginTop: 6, marginBottom: 6 }}>
        Provide short, focused answers. At least one substantive answer is recommended.
      </Text>
      {defaultQuestions.map((q: boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.Key | null | undefined, idx: number) => (
        <View key={q} style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "500" }}>{idx + 1}. {q}</Text>
          <TextInput
            value={answers[q]}
            onChangeText={(txt) => setAnswers((p) => ({ ...p, [q]: txt }))}
            placeholder="Your answer"
            multiline
            style={[styles.input, { minHeight: 80 }]}
          />
        </View>
      ))}

      <View style={{ marginTop: 18 }}>
        {submitting ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button title="Submit application" onPress={handleSubmit} />
        )}
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title="Cancel" color="#999" onPress={() => router.back()} />
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
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
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  sectionText: { color: '#444', lineHeight: 20 },
  bullet: { marginTop: 6, color: '#444' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', padding: 10, marginTop: 8 },
  uploadBox: { padding: 12, borderWidth: 1, borderColor: '#cfcfcf', borderRadius: 6, alignItems: 'center', marginTop: 8 },
});
