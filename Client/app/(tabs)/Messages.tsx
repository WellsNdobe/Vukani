// app/messages/index.tsx
import { useThemeColors } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiClient } from '@/constants/apiClient';
import { useAuth } from '@/context/authContext';
import { MaterialIcons } from '@expo/vector-icons';

type MessageThread = {
  threadId: string;
  counterpartId: string;
  counterpartName: string;
  counterpartEmail?: string;
  counterpartRole?: string;
  counterpartAvatarUrl?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount?: number;
};

export default function MessagesList() {
  const router = useRouter();
  const { colors } = useThemeColors('sage');
  const { user } = useAuth();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      if (!user?._id) {
        setThreads([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get('/messages/threads');
        setThreads(data);
      } catch (err: any) {
        setError(err?.message ?? 'Unable to load messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [user?._id]);

  const formatTimestamp = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderItem = ({ item }: { item: MessageThread }) => (
    <TouchableOpacity
      style={[
        styles.row,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
      onPress={() =>
        router.push({
          pathname: '../messages/[id]',
          params: { id: item.counterpartId, name: item.counterpartName, avatar: item.counterpartAvatarUrl ?? '' },
        })
      }
      activeOpacity={0.85}
    >
      {item.counterpartAvatarUrl ? (
        <Image source={{ uri: item.counterpartAvatarUrl }} style={[styles.logo, { backgroundColor: colors.divider }]} />
      ) : (
        <View style={[styles.logo, { backgroundColor: colors.divider }]}>
          <MaterialIcons name="business-center" size={24} color={colors.tint} />
        </View>
      )}
      <View style={styles.meta}>
        <View style={styles.metaTop}>
          <Text style={[styles.company, { color: colors.text }]}>{item.counterpartName}</Text>
          <Text style={[styles.time, { color: colors.placeholder }]}>
            {formatTimestamp(item.lastTimestamp)}
          </Text>
        </View>

        <Text style={[styles.preview, { color: colors.icon }]} numberOfLines={2} ellipsizeMode="tail">
          {item.lastMessage}
        </Text>
      </View>

      {item.unreadCount ? (
        <View style={[styles.badge, { backgroundColor: colors.tint }]}>
          <Text style={styles.badgeText}>{item.unreadCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.titleWrap, { borderBottomColor: colors.separator }]}> 
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
      </View>
      {!user?._id ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.text }]}>Log in to see your messages.</Text>
        </View>
      ) : loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="small" color={colors.tint} />
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.text }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(i) => i.threadId}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.placeholder }]}>No conversations yet.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleWrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  listContent: { padding: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderWidth: 1,
    borderRadius: 14,
  },
  logo: { width: 48, height: 48, borderRadius: 10 },
  meta: { flex: 1, marginLeft: 12 },
  metaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  company: { fontSize: 16, fontWeight: '600' },
  time: { fontSize: 12 },
  preview: { marginTop: 6, fontSize: 14, lineHeight: 20 },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  sep: { height: 10 },
  emptyState: { padding: 24 },
  emptyText: { fontSize: 14 },
  loadingState: { padding: 24, alignItems: 'center' },
});
