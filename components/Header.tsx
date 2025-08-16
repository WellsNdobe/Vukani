// components/Header.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextInput,
    TextInputSubmitEditingEventData,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  value?: string; // controlled value
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  showCancel?: boolean;
};

export default function Header({
  value,
  onChangeText,
  onSubmit,
  onCancel,
  placeholder = "Search jobs",
  autoFocus = false,
  showCancel = false,
}: Props) {
  const [text, setText] = useState(value ?? "");

  // keep internal state in sync if used as controlled component
  useEffect(() => {
    if (typeof value === "string" && value !== text) {
      setText(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (t: string) => {
    setText(t);
    onChangeText?.(t);
  };

  const handleClear = () => {
    setText("");
    onChangeText?.("");
  };

  const handleSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    onSubmit?.(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <Ionicons name="search" size={18} color="#d97c7c" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#8b8b8b"
          value={text}
          onChangeText={handleChange}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          autoFocus={autoFocus}
          underlineColorAndroid="transparent"
        />
        {text.length > 0 ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={18} color="#6b6b6b" />
          </TouchableOpacity>
        ) : null}
      </View>

      {showCancel ? (
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#d97c7cff",
    backgroundColor: "#fff",
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    color: "#111",
  },
  clearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  cancelBtn: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  cancelText: {
    color: "#d97c7c",
    fontWeight: "600",
  },
});
