import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const mockAjoGroups = [
  { 
    id: '1', 
    name: 'Jos Market Women', 
    members: 10, 
    contribution: 5000, 
    totalSaved: 100000, 
    target: 500000, 
    status: 'Active',
    nextPayout: 'Esther Danjuma' 
  },
  { 
    id: '2', 
    name: 'Bukuru Tailors', 
    members: 8, 
    contribution: 15000, 
    totalSaved: 120000, 
    target: 1200000, 
    status: 'Active',
    nextPayout: 'You (Your Turn!)' 
  },
];

export default function Ajo() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const renderAjoItem = ({ item }: { item: typeof mockAjoGroups[0] }) => {
    const progress = (item.totalSaved / item.target) * 100;
    
    return (
      <View style={[styles.ajoCard, { backgroundColor: '#FFF' }]}>
        <View style={styles.ajoHeader}>
          <View style={[styles.ajoIconContainer, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="people" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={[styles.ajoName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.ajoMembers, { color: colors.icon }]}>{item.members} Members • ₦{item.contribution.toLocaleString()}/mo</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.statusText, { color: colors.success }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.ajoDetails}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>Group Progress</Text>
            <View style={styles.progressRow}>
              <View style={[styles.progressBarBg, { backgroundColor: colors.primary + '10' }]}>
                <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${progress}%` }]} />
              </View>
              <Text style={[styles.progressPercent, { color: colors.primary }]}>{progress.toFixed(0)}%</Text>
            </View>
          </View>
          
          <View style={styles.payoutContainer}>
            <Ionicons name="gift-outline" size={16} color={colors.primary} />
            <Text style={[styles.payoutText, { color: colors.text }]}>Next Payout: </Text>
            <Text style={[styles.payoutName, { color: colors.primary }]}>{item.nextPayout}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.viewBtn, { borderColor: colors.primary }]}>
          <Text style={[styles.viewBtnText, { color: colors.primary }]}>View Group Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Ajo Groups</Text>
        <TouchableOpacity style={[styles.createBtn, { backgroundColor: colors.primary }]}>
          <Ionicons name="add" size={24} color="#FFF" />
          <Text style={styles.createBtnText}>Create Group</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
        <View>
          <Text style={styles.summaryLabel}>Total Contributions</Text>
          <Text style={styles.summaryValue}>₦45,000.00</Text>
        </View>
        <View style={styles.summaryIcon}>
          <Ionicons name="trending-up" size={32} color="rgba(255,255,255,0.6)" />
        </View>
      </View>

      <FlatList
        data={mockAjoGroups}
        renderItem={renderAjoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={[styles.listTitle, { color: colors.text }]}>Active Participations</Text>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.discoverCard}>
            <View style={[styles.discoverIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="search" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.discoverTitle, { color: colors.text }]}>Discover New Groups</Text>
              <Text style={[styles.discoverSubtitle, { color: colors.icon }]}>Join other women traders in your area.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
        }
      />
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  createBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryCard: {
    margin: 20,
    marginTop: 0,
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ajoCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  ajoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ajoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ajoName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ajoMembers: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  ajoDetails: {
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 35,
  },
  payoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FE',
    padding: 12,
    borderRadius: 12,
  },
  payoutText: {
    fontSize: 13,
    marginLeft: 8,
  },
  payoutName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  viewBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  discoverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 40,
  },
  discoverIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoverTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  discoverSubtitle: {
    fontSize: 12,
  },
});
