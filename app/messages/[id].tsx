// app/messages/[id].tsx
import { messages } from '@/data/messages';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MessageDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ?? '';
  const message = useMemo(() => messages.find((m) => m.id === id), [id]);

  const [replies, setReplies] = useState<{ id: string; text: string; timestamp: string; from: 'you' | 'company' }[]>([]);
  const [replyText, setReplyText] = useState('');

  if (!message) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Message not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const conversation = [
    { id: `company-${message.id}`, text: message.lastMessage, timestamp: message.timestamp, from: 'company' },
    ...replies,
  ];

  const sendReply = () => {
    const text = replyText.trim();
    if (!text) return;
    const newReply = { id: `you-${Date.now()}`, text, timestamp: 'now', from: 'you' } as const;
    setReplies((r) => [...r, newReply]);
    setReplyText('');
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backArea}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image source={{ uri: message.companyLogo }} style={styles.headerLogo} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.company}>{message.companyName}</Text>
            <Text style={styles.time}>{message.timestamp}</Text>
          </View>
        </View>

        <View style={{ width: 56 }} />
      </View>

      <FlatList
        data={conversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.convoContainer}
        renderItem={({ item }) => {
          const isYou = item.from === 'you';
          return (
            <View style={[styles.bubbleRow, isYou ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
              {!isYou && <Image source={{ uri: message.companyLogo }} style={styles.bubbleLogo} />}
              <View style={[styles.bubble, isYou ? styles.bubbleYou : styles.bubbleCompany]}>
                <Text style={isYou ? styles.bubbleTextYou : styles.bubbleTextCompany}>{item.text}</Text>
                <Text style={styles.bubbleTimestamp}>{item.timestamp}</Text>
              </View>
            </View>
          );
        }}
      />

      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}>
        <View style={styles.composer}>
          <TextInput style={styles.input} placeholder="Write a reply..." value={replyText} onChangeText={setReplyText} multiline />
          <TouchableOpacity style={styles.sendButton} onPress={sendReply}><Text style={styles.sendText}>Send</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  header: { height: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backArea: { width: 56 },
  backText: { color: '#007AFF', fontWeight: '600' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  headerLogo: { width: 40, height: 40, borderRadius: 8 },
  company: { fontSize: 16, fontWeight: '700', color: '#222' },
  time: { fontSize: 12, color: '#888' },
  convoContainer: { paddingHorizontal: 12, paddingVertical: 16, paddingBottom: 120 },

  bubbleRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleLogo: { width: 36, height: 36, borderRadius: 8, marginRight: 8 },
  backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 20,
},

  bubble: { maxWidth: '78%', padding: 10, borderRadius: 12 },
  bubbleCompany: { backgroundColor: '#f2f2f2', borderTopLeftRadius: 4 },
  bubbleYou: { backgroundColor: '#007AFF', borderTopRightRadius: 4 },
  bubbleTextCompany: { color: '#222', fontSize: 15 },
  bubbleTextYou: { color: '#fff', fontSize: 15 },
  bubbleTimestamp: { marginTop: 6, fontSize: 11, color: '#666', alignSelf: 'flex-end' },

  composer: { paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#fff' },
  input: { flex: 1, maxHeight: 120, minHeight: 40, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa' },
  sendButton: { marginLeft: 8, backgroundColor: '#007AFF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  sendText: { color: '#fff', fontWeight: '700' },

  notFoundContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 18, color: '#222', marginBottom: 12 },
});
