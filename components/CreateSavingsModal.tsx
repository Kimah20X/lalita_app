import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useApp } from '@/context/AppState';
import { AutoSaveFrequency } from '@/types';

interface CreateSavingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateSavingsModal({ visible, onClose }: CreateSavingsModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { addSavingsGoal } = useApp();

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [frequency, setFrequency] = useState<AutoSaveFrequency | 'None'>('None');

  const frequencies: (AutoSaveFrequency | 'None')[] = ['None', 'Daily', 'Weekly', 'Monthly'];

  const handleCreate = () => {
    if (!name || !target) return;
    addSavingsGoal({
      name,
      targetAmount: parseFloat(target),
      frequency: frequency === 'None' ? 'Monthly' : frequency, // Default to monthly if none, or we could change type
    });
    setName('');
    setTarget('');
    setFrequency('None');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={[styles.modalView, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Savings Goal</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
              <Text style={[styles.label, { color: colors.icon }]}>Goal Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
                placeholder="e.g. New Sewing Machine"
                placeholderTextColor={colors.icon}
              />

              <Text style={[styles.label, { color: colors.icon }]}>Target Amount (₦)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                value={target}
                onChangeText={setTarget}
                placeholder="50000"
                keyboardType="numeric"
                placeholderTextColor={colors.icon}
              />

              <Text style={[styles.label, { color: colors.icon }]}>Savings Frequency (Optional)</Text>
              <View style={styles.freqRow}>
                {frequencies.map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.freqBtn,
                      { borderColor: colors.primary, backgroundColor: frequency === freq ? colors.primary : 'transparent' }
                    ]}
                    onPress={() => setFrequency(freq)}
                  >
                    <Text style={[styles.freqText, { color: frequency === freq ? '#FFF' : colors.primary }]}>
                      {freq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.createBtn, { backgroundColor: colors.primary }]}
                onPress={handleCreate}
              >
                <Text style={styles.createBtnText}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    gap: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  freqRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  freqBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  freqText: {
    fontSize: 13,
    fontWeight: '600',
  },
  createBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  createBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
