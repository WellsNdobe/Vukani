// app/messages/[id].tsx
import { useThemeColors } from '@/hooks/useThemeColor';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiClient } from '@/constants/apiClient';
import { useAuth } from '@/context/authContext';
import { MaterialIcons } from '@expo/vector-icons';

type ChatMessage = {
  id: string;
  text: string;
  timestamp: string;
  from: 'you' | 'company';
};

export default function MessageDetail() {
  const router = useRouter();
  const { colors } = useThemeColors('sage');
  const params = useLocalSearchParams<{ id?: string; name?: string; avatar?: string }>();
  const id = params.id ?? '';
  const counterpartName = params.name ?? 'Conversation';
  const counterpartAvatar = params.avatar ?? '';
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!user?._id || !id) return;

      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get(`/messages/between/${user._id}/${id}`);
        const mapped = (data ?? []).map((item: any) => ({
          id: item._id,
          text: item.content,
          timestamp: new Date(item.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
          from: item.sender === user._id ? 'you' : 'company',
        }));
        setMessages(mapped);
        await apiClient.post(`/messages/read/${id}`);
      } catch (err: any) {
        setError(err?.message ?? 'Unable to load conversation.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [user?._id, id]);

  const sendReply = async () => {
    const text = replyText.trim();
    if (!text) return;
    if (!user?._id || !id) return;

    try {
      const { data } = await apiClient.post('/messages/send', {
        receiverId: id,
        content: text,
      });

      const nextMessage: ChatMessage = {
        id: data?._id ?? `you-${Date.now()}`,
        text,
        timestamp: new Date(data?.timestamp ?? Date.now()).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
        from: 'you',
      };

      setMessages((prev) => [...prev, nextMessage]);
      setReplyText('');
    } catch (err: any) {
      setError(err?.message ?? 'Unable to send message.');
    }
  };

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: colors.background }]}> 
      {!user?._id ? (
        <View style={styles.loadingWrap}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>Log in to view messages.</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.tint }]}
          >
            <Text style={styles.backTextButton}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
      <View style={[styles.header, { borderBottomColor: colors.separator }]}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.backArea}>
          <Text style={[styles.backText, { color: colors.tint }]}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          {counterpartAvatar ? (
            <Image source={{ uri: counterpartAvatar }} style={styles.headerLogo} />
          ) : (
            <View style={[styles.headerLogo, { backgroundColor: colors.divider }]}>
              <MaterialIcons name="business-center" size={20} color={colors.tint} />
            </View>
          )}
          <View style={styles.headerMeta}>
            <Text style={[styles.company, { color: colors.text }]}>{counterpartName}</Text>
            <Text style={[styles.time, { color: colors.placeholder }]}>
              {loading ? 'Loading...' : error ? 'Error' : ' '}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.typingToggle, { borderColor: colors.border, backgroundColor: isTyping ? colors.divider : colors.cardBackground }]}
          onPress={() => setIsTyping((prev) => !prev)}
        >
          <Text style={[styles.typingToggleText, { color: colors.tint }]}>{isTyping ? 'Typing On' : 'Typing Test'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.tint} />
        </View>
      ) : error ? (
        <View style={styles.loadingWrap}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.convoContainer}
        renderItem={({ item }) => {
          const isYou = item.from === 'you';
          return (
            <View style={[styles.bubbleRow, isYou ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
              {!isYou && (
                counterpartAvatar ? (
                  <Image source={{ uri: counterpartAvatar }} style={styles.bubbleLogo} />
                ) : (
                  <View style={[styles.bubbleLogo, { backgroundColor: colors.divider }]}>
                    <MaterialIcons name="business-center" size={16} color={colors.tint} />
                  </View>
                )
              )}
              <View
                style={[
                  styles.bubble,
                  isYou
                    ? [styles.bubbleYou, { backgroundColor: colors.tint }]
                    : [styles.bubbleCompany, { backgroundColor: colors.divider, borderColor: colors.border }],
                ]}
              >
                <Text style={isYou ? styles.bubbleTextYou : [styles.bubbleTextCompany, { color: colors.text }]}>
                  {item.text}
                </Text>
                <Text style={[styles.bubbleTimestamp, { color: isYou ? '#E8FFF2' : colors.placeholder }]}>
                  {item.timestamp}
                </Text>
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          isTyping ? (
            <View style={[styles.typingWrap, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}>
              {counterpartAvatar ? (
                <Image source={{ uri: counterpartAvatar }} style={styles.typingLogo} />
              ) : (
                <View style={[styles.typingLogo, { backgroundColor: colors.divider }]}>
                  <MaterialIcons name="business-center" size={14} color={colors.tint} />
                </View>
              )}
              <View style={[styles.typingBubble, { backgroundColor: colors.divider }]}>
                <Text style={[styles.typingText, { color: colors.placeholder }]}>{counterpartName} is typing...</Text>
              </View>
            </View>
          ) : null
        }
      />
      )}

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        <View style={[styles.composer, { borderTopColor: colors.separator, backgroundColor: colors.background }]}> 
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.cardBackground, color: colors.text }]}
            placeholder="Write a reply..."
            placeholderTextColor={colors.placeholder}
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.tint }]} onPress={sendReply}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  header: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  backArea: { width: 52 },
  backText: { fontWeight: '600' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  headerLogo: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  headerMeta: { marginLeft: 10 },
  company: { fontSize: 16, fontWeight: '700' },
  time: { fontSize: 12 },
  typingToggle: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  typingToggleText: { fontSize: 11, fontWeight: '700' },
  convoContainer: { paddingHorizontal: 12, paddingVertical: 16, paddingBottom: 120 },

  bubbleRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleLogo: { width: 36, height: 36, borderRadius: 8, marginRight: 8, alignItems: 'center', justifyContent: 'center' },

  bubble: { maxWidth: '78%', padding: 10, borderRadius: 14 },
  bubbleCompany: { borderTopLeftRadius: 4, borderWidth: 1 },
  bubbleYou: { borderTopRightRadius: 4 },
  bubbleTextCompany: { fontSize: 15 },
  bubbleTextYou: { color: '#fff', fontSize: 15 },
  bubbleTimestamp: { marginTop: 6, fontSize: 11, alignSelf: 'flex-end' },

  typingWrap: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    alignSelf: 'flex-start',
  },
  typingLogo: { width: 28, height: 28, borderRadius: 7, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  typingBubble: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  typingText: { fontSize: 12, fontWeight: '500' },

  composer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  sendButton: { marginLeft: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  sendText: { color: '#fff', fontWeight: '700' },

  notFoundContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 18, marginBottom: 12 },
  loadingWrap: { padding: 16, alignItems: 'center' },
  backButton: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  backTextButton: { color: '#fff', fontWeight: '700' },
});
