import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useApp } from '@/context/AppState';
import { formatCurrency } from '@/utils/format';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { totalBalance, totalDeposits, totalWithdrawals, isMoneyVisible, toggleMoneyVisibility, savingsGoals, ajoGroups } = useApp();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { color: colors.icon }]}>{t('common.welcome')}</Text>
            <Text style={[styles.userName, { color: colors.text }]}>Esther Danjuma</Text>
          </View>
          <TouchableOpacity style={[styles.notificationBtn, { borderColor: colors.border }]}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={[styles.notificationBadge, { backgroundColor: colors.primary }]} />
          </TouchableOpacity>
        </View>

        {/* Total Savings Card */}
        <View style={[styles.savingsCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.savingsLabel}>{t('common.total_savings')}</Text>
          <Text style={styles.savingsAmount}>{formatCurrency(250000, isMoneyVisible)}</Text>
          <View style={styles.savingsFooter}>
            <View>
              <Text style={styles.availableLabel}>{t('common.available_balance')}</Text>
              <Text style={styles.availableAmount}>{formatCurrency(totalBalance, isMoneyVisible)}</Text>
            </View>
            <TouchableOpacity onPress={toggleMoneyVisibility}>
              <Ionicons name={isMoneyVisible ? "eye-outline" : "eye-off-outline"} size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="add-circle" size={24} color="#FFF" />
            <Text style={styles.actionText}>{t('common.deposit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.primary }]}>
            <Ionicons name="remove-circle" size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>{t('common.withdraw')}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#FFF' }]}>
            <Text style={[styles.statLabel, { color: colors.icon }]}>{t('common.total_deposits')}</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>{formatCurrency(totalDeposits, isMoneyVisible)}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF' }]}>
            <Text style={[styles.statLabel, { color: colors.icon }]}>{t('common.total_withdrawals')}</Text>
            <Text style={[styles.statValue, { color: colors.error }]}>{formatCurrency(totalWithdrawals, isMoneyVisible)}</Text>
          </View>
        </View>

        {/* Savings Goals Preview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('common.savings_goals')}</Text>
          <TouchableOpacity>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>{t('common.see_all')}</Text>
          </TouchableOpacity>
        </View>

        {savingsGoals.length > 0 ? (
          <View style={[styles.goalCard, { backgroundColor: '#FFF' }]}>
            <View style={styles.goalHeader}>
              <View style={[styles.goalIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="briefcase" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.goalName, { color: colors.text }]}>{savingsGoals[0].name}</Text>
                <Text style={[styles.goalProgressText, { color: colors.icon }]}>
                  {Math.round((savingsGoals[0].savedAmount / savingsGoals[0].targetAmount) * 100)}% complete
                </Text>
              </View>
              <Text style={[styles.goalAmount, { color: colors.primary }]}>
                {formatCurrency(savingsGoals[0].savedAmount, isMoneyVisible)}/{formatCurrency(savingsGoals[0].targetAmount, isMoneyVisible)}
              </Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.primary + '10' }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${Math.min(100, (savingsGoals[0].savedAmount / savingsGoals[0].targetAmount) * 100)}%`
                  }
                ]}
              />
            </View>
          </View>
        ) : null}

        {/* Ajo Summary Preview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('common.ajo_groups')}</Text>
          <TouchableOpacity>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>{t('common.see_all')}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.ajoSummaryCard, { backgroundColor: colors.primary + '10' }]}>
          <View style={styles.ajoSummaryInfo}>
            <Ionicons name="people" size={24} color={colors.primary} />
            <Text style={[styles.ajoSummaryText, { color: colors.text }]}>
              {ajoGroups.length > 0 ? `You are in ${ajoGroups.length} active Ajo groups` : 'No active Ajo groups'}
            </Text>
          </View>
          {ajoGroups.length > 0 && (
            <Text style={[styles.ajoContributionText, { color: colors.icon }]}>
              Next contribution: {formatCurrency(ajoGroups[0].contributionAmount, isMoneyVisible)} on Oct 25
            </Text>
          )}
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
