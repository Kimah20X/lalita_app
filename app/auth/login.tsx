import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function Login() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [form, setForm] = useState({
    phoneNumber: '',
    password: '',
  });

  const handleLogin = () => {
    // Logic will be added with State management
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.primary }]}>Lalita</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>Save Smart. Learn Fast. Stay Safe. Grow Strong.</Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.formTitle, { color: colors.text }]}>Welcome back</Text>
          <Text style={[styles.formSubtitle, { color: colors.icon }]}>Login to continue saving</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="08012345678"
              placeholderTextColor={colors.icon}
              keyboardType="phone-pad"
              value={form.phoneNumber}
              onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="••••••••"
              placeholderTextColor={colors.icon}
              secureTextEntry
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={{ color: colors.icon }}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.trustText, { color: colors.icon }]}>
          Trusted by 8,400+ women traders in Plateau State
        </Text>
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
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLink: {
    fontWeight: 'bold',
  },
  trustText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 12,
  },
});
