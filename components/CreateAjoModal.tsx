import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useApp } from '@/context/AppState';

interface CreateAjoModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateAjoModal({ visible, onClose }: CreateAjoModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { addAjoGroup } = useApp();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [members, setMembers] = useState(5);

  const handleCreate = () => {
    if (!name || !amount) return;
    addAjoGroup({
      name,
      contributionAmount: parseFloat(amount),
      membersCount: members,
      targetAmount: parseFloat(amount) * members,
    });
    setName('');
    setAmount('');
    setMembers(5);
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
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Ajo Group</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.icon }]}>Group Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Market Women Group"
              placeholderTextColor={colors.icon}
            />

            <Text style={[styles.label, { color: colors.icon }]}>Contribution Amount (₦)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="5000"
              keyboardType="numeric"
              placeholderTextColor={colors.icon}
            />

            <Text style={[styles.label, { color: colors.icon }]}>Number of Members: {members}</Text>
            <View style={styles.memberControl}>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: colors.primary }]}
                onPress={() => setMembers(Math.max(2, members - 1))}
              >
                <Ionicons name="remove" size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={[styles.memberCount, { color: colors.text }]}>{members}</Text>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: colors.primary }]}
                onPress={() => setMembers(members + 1)}
              >
                <Ionicons name="add" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: colors.primary }]}
              onPress={handleCreate}
            >
              <Text style={styles.createBtnText}>Create Group</Text>
            </TouchableOpacity>
          </View>
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
    minHeight: '60%',
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
  memberControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 16,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 20,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  createBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  createBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
