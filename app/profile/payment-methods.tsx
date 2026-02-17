import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const mockCards = [
  { id: '1', brand: 'Mastercard', last4: '4242', expiry: '12/25' },
  { id: '2', brand: 'Visa', last4: '8888', expiry: '06/24' },
];

export default function PaymentMethods() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const renderItem = ({ item }: { item: typeof mockCards[0] }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardInfo}>
        <Ionicons name="card" size={32} color={colors.primary} />
        <View style={{ marginLeft: 16 }}>
          <Text style={[styles.cardBrand, { color: colors.text }]}>{item.brand} •••• {item.last4}</Text>
          <Text style={[styles.cardExpiry, { color: colors.icon }]}>Expires {item.expiry}</Text>
        </View>
      </View>
      <TouchableOpacity>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <FlatList
          data={mockCards}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={
            <TouchableOpacity style={[styles.addBtn, { borderColor: colors.primary }]}>
              <Ionicons name="add" size={24} color={colors.primary} />
              <Text style={[styles.addBtnText, { color: colors.primary }]}>Add New Card</Text>
            </TouchableOpacity>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardExpiry: {
    fontSize: 14,
  },
  addBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 8,
    gap: 8,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
