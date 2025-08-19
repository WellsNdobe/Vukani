// components/MessageList.tsx
import { Message, messages } from '@/data/messages'; // adjust path if needed
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MessageList() {
  const [selected, setSelected] = useState<Message | null>(null);

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity style={styles.row} onPress={() => setSelected(item)}>
      <Image source={{ uri: item.companyLogo }} style={styles.logo} />
      <View style={styles.meta}>
        <View style={styles.metaTop}>
          <Text style={styles.company}>{item.companyName}</Text>
          <Text style={styles.time}>{item.timestamp}</Text>
        </View>

        <Text
          style={styles.preview}
          numberOfLines={2} // truncate long messages in the list
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

      {/* Simple modal to show full message details */}
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selected && (
              <>
                <View style={styles.modalHeader}>
                  <Image source={{ uri: selected.companyLogo }} style={styles.modalLogo} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.company}>{selected.companyName}</Text>
                    <Text style={styles.time}>{selected.timestamp}</Text>
                  </View>
                </View>

                <View style={{ marginTop: 12 }}>
                  <Text style={styles.fullMessage}>{selected.lastMessage}</Text>
                </View>

                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Pressable onPress={() => setSelected(null)} style={styles.closeButton}>
                    <Text style={styles.closeText}>Close</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center' },
  modalLogo: { width: 56, height: 56, borderRadius: 10 },
  fullMessage: { fontSize: 15, color: '#333', lineHeight: 20 },
  closeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  closeText: { color: '#fff', fontWeight: '600' },
});
