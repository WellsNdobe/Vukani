// app/messages/index.tsx
import { useThemeColors } from '@/hooks/useThemeColor';
import { Message, messages } from '@/data/messages';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MessagesList() {
  const router = useRouter();
  const { colors } = useThemeColors('sage');

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={[
        styles.row,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
      onPress={() => router.push(`../messages/${item.id}`)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.companyLogo }} style={[styles.logo, { backgroundColor: colors.divider }]} />
      <View style={styles.meta}>
        <View style={styles.metaTop}>
          <Text style={[styles.company, { color: colors.text }]}>{item.companyName}</Text>
          <Text style={[styles.time, { color: colors.placeholder }]}>{item.timestamp}</Text>
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
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={styles.listContent}
      />
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
});
