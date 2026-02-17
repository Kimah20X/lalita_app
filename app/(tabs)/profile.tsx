import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const settingsOptions = [
    { icon: 'person-outline', label: 'Personal Information', value: '' },
    { icon: 'shield-outline', label: 'Security & Password', value: '' },
    { icon: 'card-outline', label: 'Payment Methods', value: '' },
    { icon: 'help-circle-outline', label: 'Help & Support', value: '' },
    { icon: 'information-circle-outline', label: 'About Lalita', value: 'v1.0.0' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.error }]}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        <View style={[styles.userCard, { backgroundColor: '#FFF' }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>ED</Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>Esther Danjuma</Text>
          <Text style={[styles.userPhone, { color: colors.icon }]}>+234 801 234 5678</Text>
          <View style={[styles.businessBadge, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.businessText, { color: colors.primary }]}>Fashion Designer</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>APP PREFERENCES</Text>
          <View style={[styles.settingsList, { backgroundColor: '#FFF' }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.primary + '10' }]}>
                  <Ionicons name="notifications" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
            <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.primary + '10' }]}>
                  <Ionicons name="moon" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>ACCOUNT SETTINGS</Text>
          <View style={[styles.settingsList, { backgroundColor: '#FFF' }]}>
            {settingsOptions.map((item, index) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: colors.primary + '10' }]}>
                      <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                    </View>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item.value ? <Text style={[styles.settingValue, { color: colors.icon }]}>{item.value}</Text> : null}
                    <Ionicons name="chevron-forward" size={20} color={colors.icon} />
                  </View>
                </TouchableOpacity>
                {index < settingsOptions.length - 1 && (
                  <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.deleteBtn}
          onPress={() => router.replace('/onboarding')}
        >
          <Text style={[styles.deleteText, { color: colors.error }]}>Reset App (Back to Onboarding)</Text>
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: colors.icon }]}>Lalita v1.0.0 • Made with ❤️ for Women Traders</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    marginBottom: 16,
  },
  businessBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  businessText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsList: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    marginRight: 4,
  },
  settingDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  deleteBtn: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 40,
  },
});
