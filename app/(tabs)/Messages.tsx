import { Message, messages } from '@/data/messages';
import { useThemeColors } from '@/hooks/useThemeColor';
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
  const { colors } = useThemeColors("nude");
  const [selected, setSelected] = useState<Message | null>(null);
  
  // Complementary colors for the nude theme
  const complementaryColors = {
    border: "#e0d7c9",        // Light clay border
    placeholder: "#8c6b5a",   // Muted brown
    cardBackground: "#f8f4f0", // Very light cream
    badge: "#8a9a5b",         // Moss green (for unread badges)
  };

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity 
      style={[styles.row, { backgroundColor: '#fff' }]} 
      onPress={() => setSelected(item)}
    >
      <View style={[styles.logo, { backgroundColor: complementaryColors.cardBackground }]}>
        {item.companyLogo ? (
          <Image source={{ uri: item.companyLogo }} style={styles.logoImage} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={[styles.logoText, { color: colors.tint }]}>
              {item.companyName.charAt(0)}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.meta}>
        <View style={styles.metaTop}>
          <Text style={[styles.company, { color: colors.text }]}>{item.companyName}</Text>
          <Text style={[styles.time, { color: complementaryColors.placeholder }]}>{item.timestamp}</Text>
        </View>

        <Text
          style={[styles.preview, { color: colors.icon }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.lastMessage}
        </Text>
      </View>

      {item.unreadCount ? (
        <View style={[styles.badge, { backgroundColor: complementaryColors.badge }]}>
          <Text style={styles.badgeText}>{item.unreadCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={[styles.sep, { backgroundColor: complementaryColors.border }]} />}
        contentContainerStyle={{ padding: 12 }}
      />

      {/* Message Detail Modal */}
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: '#fff' }]}>
            {selected && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalLogo, { backgroundColor: complementaryColors.cardBackground }]}>
                    {selected.companyLogo ? (
                      <Image source={{ uri: selected.companyLogo }} style={styles.modalLogoImage} />
                    ) : (
                      <View style={styles.modalLogoPlaceholder}>
                        <Text style={[styles.modalLogoText, { color: colors.tint }]}>
                          {selected.companyName.charAt(0)}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={[styles.company, { color: colors.text }]}>{selected.companyName}</Text>
                    <Text style={[styles.time, { color: complementaryColors.placeholder }]}>{selected.timestamp}</Text>
                  </View>
                </View>

                <View style={{ marginTop: 20 }}>
                  <Text style={[styles.fullMessage, { color: colors.text }]}>{selected.lastMessage}</Text>
                </View>

                <View style={{ marginTop: 28, flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                  <Pressable 
                    onPress={() => setSelected(null)} 
                    style={[styles.closeButton, { borderColor: complementaryColors.border }]}
                  >
                    <Text style={[styles.closeText, { color: colors.text }]}>Close</Text>
                  </Pressable>
                  
                  <Pressable 
                    onPress={() => console.log("Reply pressed")} 
                    style={[styles.replyButton, { backgroundColor: colors.tint }]}
                  >
                    <Text style={styles.replyText}>Reply</Text>
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
  container: { 
    flex: 1, 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  logo: {
    width: 56, 
    height: 56, 
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0e6d8',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
  },
  meta: { 
    flex: 1, 
    marginLeft: 16 
  },
  metaTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 6,
  },
  company: { 
    fontSize: 17, 
    fontWeight: '600',
    flexShrink: 1,
  },
  time: { 
    fontSize: 13,
    marginLeft: 8,
  },
  preview: { 
    fontSize: 15,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    alignSelf: 'center',
  },
  badgeText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 12 
  },
  sep: { 
    height: 1, 
    marginHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  modalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  modalLogo: { 
    width: 64, 
    height: 64, 
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalLogoImage: {
    width: '100%',
    height: '100%',
  },
  modalLogoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0e6d8',
  },
  modalLogoText: {
    fontSize: 24,
    fontWeight: '700',
  },
  fullMessage: { 
    fontSize: 16, 
    lineHeight: 24,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  closeText: { 
    fontWeight: '500',
  },
  replyButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  replyText: {
    color: '#fff',
    fontWeight: '600',
  },
});