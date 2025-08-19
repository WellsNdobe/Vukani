// app/messages/index.tsx
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

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`../messages/${item.id}`)}
    >
      <Image source={{ uri: item.companyLogo }} style={styles.logo} />
      <View style={styles.meta}>
        <View style={styles.metaTop}>
          <Text style={styles.company}>{item.companyName}</Text>
          <Text style={styles.time}>{item.timestamp}</Text>
        </View>

        <Text
          style={styles.preview}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.lastMessage}
        </Text>
      </View>

      {item.unreadCount ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unreadCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ padding: 12 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  logo: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#eee' },
  meta: { flex: 1, marginLeft: 12 },
  metaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  company: { fontSize: 16, fontWeight: '600', color: '#222' },
  time: { fontSize: 12, color: '#888' },
  preview: { marginTop: 6, fontSize: 14, color: '#444' },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  sep: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 4 },
});
