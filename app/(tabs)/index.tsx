import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function Dashboard() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { color: colors.icon }]}>Welcome back,</Text>
            <Text style={[styles.userName, { color: colors.text }]}>Esther Danjuma</Text>
          </View>
          <TouchableOpacity style={[styles.notificationBtn, { borderColor: colors.border }]}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={[styles.notificationBadge, { backgroundColor: colors.primary }]} />
          </TouchableOpacity>
        </View>

        {/* Total Savings Card */}
        <View style={[styles.savingsCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.savingsLabel}>Total Savings</Text>
          <Text style={styles.savingsAmount}>₦250,000.00</Text>
          <View style={styles.savingsFooter}>
            <View>
              <Text style={styles.availableLabel}>Available Balance</Text>
              <Text style={styles.availableAmount}>₦45,000.00</Text>
            </View>
            <Ionicons name="eye-outline" size={24} color="#FFF" />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="add-circle" size={24} color="#FFF" />
            <Text style={styles.actionText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.primary }]}>
            <Ionicons name="remove-circle" size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#FFF' }]}>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Total Deposits</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>₦200,000</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF' }]}>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Total Withdrawals</Text>
            <Text style={[styles.statValue, { color: colors.error }]}>₦155,000</Text>
          </View>
        </View>

        {/* Savings Goals Preview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Savings Goals</Text>
          <TouchableOpacity>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.goalCard, { backgroundColor: '#FFF' }]}>
          <View style={styles.goalHeader}>
            <View style={[styles.goalIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="briefcase" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.goalName, { color: colors.text }]}>Business Expansion</Text>
              <Text style={[styles.goalProgressText, { color: colors.icon }]}>60% complete</Text>
            </View>
            <Text style={[styles.goalAmount, { color: colors.primary }]}>₦150k/₦250k</Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: colors.primary + '10' }]}>
            <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: '60%' }]} />
          </View>
        </View>

        {/* Ajo Summary Preview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ajo Groups</Text>
          <TouchableOpacity>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.ajoSummaryCard, { backgroundColor: colors.primary + '10' }]}>
          <View style={styles.ajoSummaryInfo}>
            <Ionicons name="people" size={24} color={colors.primary} />
            <Text style={[styles.ajoSummaryText, { color: colors.text }]}>You are in 2 active Ajo groups</Text>
          </View>
          <Text style={[styles.ajoContributionText, { color: colors.icon }]}>Next contribution: ₦5,000 on Oct 25</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  savingsCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  savingsLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  savingsAmount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  savingsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  availableLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  availableAmount: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalProgressText: {
    fontSize: 12,
  },
  goalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  ajoSummaryCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  ajoSummaryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  ajoSummaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  ajoContributionText: {
    fontSize: 14,
  },
});
