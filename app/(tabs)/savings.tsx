import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useApp } from '@/context/AppState';
import { formatCurrency } from '@/utils/format';
import { useTranslation } from 'react-i18next';
import CreateSavingsModal from '@/components/CreateSavingsModal';

const mockGoals = [
  { id: '1', name: 'Business Expansion', saved: 150000, target: 250000, frequency: 'Weekly', icon: 'briefcase' },
  { id: '2', name: 'Emergency Fund', saved: 45000, target: 200000, frequency: 'Monthly', icon: 'shield-checkmark' },
  { id: '3', name: 'School Fees', saved: 80000, target: 120000, frequency: 'Daily', icon: 'school' },
];

export default function Savings() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { isMoneyVisible, savingsGoals } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const displayGoals = savingsGoals.length > 0 ? savingsGoals.map(g => ({
    ...g,
    saved: g.savedAmount,
    target: g.targetAmount,
    icon: g.icon || 'wallet'
  })) : mockGoals;

  const renderGoalItem = ({ item }: { item: typeof mockGoals[0] }) => {
    const progress = (item.saved / item.target) * 100;
    
    return (
      <View style={[styles.goalCard, { backgroundColor: '#FFF' }]}>
        <View style={styles.goalHeader}>
          <View style={[styles.goalIconContainer, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name={item.icon as any} size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={[styles.goalName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.goalFrequency, { color: colors.icon }]}>{item.frequency} savings</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.goalDetails}>
          <View>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>{t('common.saved')}</Text>
            <Text style={[styles.detailValue, { color: colors.primary }]}>{formatCurrency(item.saved, isMoneyVisible)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.detailLabel, { color: colors.icon }]}>{t('common.target')}</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{formatCurrency(item.target, isMoneyVisible)}</Text>
          </View>
        </View>

        <View style={[styles.progressContainer, { backgroundColor: colors.primary + '10' }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${progress}%` }]} />
        </View>
        <Text style={[styles.progressText, { color: colors.icon }]}>{progress.toFixed(0)}% {t('common.complete')}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('common.savings_goals')}</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <CreateSavingsModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <FlatList
        data={displayGoals}
        renderItem={renderGoalItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={80} color={colors.icon} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('common.no_goals')}</Text>
            <Text style={[styles.emptySubtitle, { color: colors.icon }]}>{t('common.create_first_goal')}</Text>
            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: colors.primary }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.createBtnText}>{t('common.create_goal')}</Text>
            </TouchableOpacity>
          </View>
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
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  goalCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalFrequency: {
    fontSize: 12,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createBtn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  createBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
