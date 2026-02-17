import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppState';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user, theme, setTheme, language, setLanguage } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const settingsOptions = [
    { icon: 'person-outline', label: t('common.personal_info'), route: '/profile/personal-info' },
    { icon: 'shield-outline', label: t('common.security'), route: '/profile/security' },
    { icon: 'card-outline', label: t('common.payment_methods'), route: '/profile/payment-methods' },
    { icon: 'help-circle-outline', label: t('common.help_support'), route: '/profile/help' },
    { icon: 'information-circle-outline', label: t('common.about'), value: 'v1.0.0', route: null },
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
            <Text style={styles.avatarText}>
              {user?.fullName?.split(' ').map(n => n[0]).join('') || 'ED'}
            </Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{user?.fullName || 'Esther Danjuma'}</Text>
          <Text style={[styles.userPhone, { color: colors.icon }]}>{user?.phoneNumber || '+234 801 234 5678'}</Text>
          <View style={[styles.businessBadge, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.businessText, { color: colors.primary }]}>{user?.businessType || 'Fashion Designer'}</Text>
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
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.primary + '10' }]}>
                  <Ionicons name="moon" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>{t('common.dark_mode')}</Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
            <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.primary + '10' }]}>
                  <Ionicons name="language" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Language</Text>
              </View>
              <View style={styles.langSelector}>
                {(['en', 'ha', 'yo', 'ig'] as const).map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => setLanguage(lang)}
                    style={[
                      styles.langBtn,
                      language === lang && { backgroundColor: colors.primary }
                    ]}
                  >
                    <Text style={[
                      styles.langBtnText,
                      { color: language === lang ? '#FFF' : colors.primary }
                    ]}>
                      {lang.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>ACCOUNT SETTINGS</Text>
          <View style={[styles.settingsList, { backgroundColor: '#FFF' }]}>
            {settingsOptions.map((item, index) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => item.route && router.push(item.route as any)}
                >
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
  langSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#9C27B0',
  },
  langBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
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
