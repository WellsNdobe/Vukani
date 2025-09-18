import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

const { supabaseUrl, supabaseKey } = Constants.expoConfig?.extra || {};
const supabase = createClient(supabaseUrl, supabaseKey);

const Jobs = () => {
  const [uploading, setUploading] = useState(false);

  const pickAndUpload = async () => {
    try {
      // Pick a file
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true, // ✅ ensures local path
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      setUploading(true);

      // Convert to ArrayBuffer → Uint8Array
      const response = await fetch(file.uri);
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Upload to Supabase
      const { error } = await supabase.storage
        .from("Vukani-CVs") // your bucket
        .upload(filePath, uint8Array, {
          contentType: file.mimeType || "application/octet-stream",
          upsert: true, // overwrite if exists
        });

      if (error) throw error;

      // Get public URL
      const { data } = supabase.storage
        .from("Vukani-CVs")
        .getPublicUrl(filePath);

      Alert.alert("Upload success!", `File URL:\n${data.publicUrl}`);
    } catch (err: any) {
      console.error("Upload error:", err);
      Alert.alert("Upload failed", err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>this is a jobs page</Text>
      <Button
        title={uploading ? "Uploading..." : "Upload Resume"}
        onPress={pickAndUpload}
        disabled={uploading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default Jobs;
