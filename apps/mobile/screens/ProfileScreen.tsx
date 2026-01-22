import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import Firebase from '@/api/Firebase';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { languageNames, supportedLanguages, type SupportedLanguage } from '@/lang';
import { useAuthStore } from '@/stores/authStore';
import { LoginForm } from './LoginScreen';

export function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    Firebase.track('logout');
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    Firebase.track('language_changed', { language: lang });
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">{t('profile.title')}</ThemedText>
        <ThemedText style={styles.email}>{user?.email}</ThemedText>
        <ThemedText style={styles.name}>{user?.displayName}</ThemedText>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('profile.language')}</ThemedText>
          <View style={styles.languageGrid}>
            {supportedLanguages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageButton,
                  {
                    borderColor: i18n.language === lang ? colors.tint : colors.icon,
                    backgroundColor: i18n.language === lang
                      ? (colorScheme === 'dark' ? '#1a3a4a' : '#e6f3ff')
                      : 'transparent',
                  },
                ]}
                onPress={() => handleLanguageChange(lang)}
              >
                <ThemedText
                  style={[
                    styles.languageText,
                    i18n.language === lang && { color: colors.tint, fontWeight: '600' },
                  ]}
                >
                  {languageNames[lang]}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.tint }]}
          onPress={handleLogout}
        >
          <ThemedText style={[styles.logoutText, { color: colors.tint }]}>
            {t('common.signOut')}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  email: {
    marginTop: 8,
    opacity: 0.7,
  },
  name: {
    marginTop: 4,
    fontSize: 18,
  },
  section: {
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  languageText: {
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
