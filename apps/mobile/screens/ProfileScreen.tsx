import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMutation } from '@apollo/client/react';

import Analytics from '@/api/Analytics';
import Firebase from '@/api/Firebase';
import { CANCEL_SUBSCRIPTION_MUTATION } from '@/api/graphql_queries';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { languageNames, supportedLanguages, type SupportedLanguage } from '@/lang';
import { useAuthStore, User } from '@/stores/authStore';
import { LoginForm } from './LoginScreen';

type CancelSubscriptionData = {
  cancelSubscription: {
    success: boolean;
    message: string;
    user: User;
  };
};

export function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { 
    isAuthenticated, 
    user, 
    logout, 
    updateUser,
    clearAnonymousSubscription,
    hasActiveAnonymousSubscription,
    anonymousSubscription,
  } = useAuthStore();
  
  const isAnonymousSubscribed = hasActiveAnonymousSubscription();

  const [cancelSubscription, { loading: cancelLoading }] = useMutation<CancelSubscriptionData>(CANCEL_SUBSCRIPTION_MUTATION, {
    onCompleted: (data: CancelSubscriptionData) => {
      if (data.cancelSubscription.success) {
        Analytics.trackSubscriptionCancelSuccess();
        updateUser(data.cancelSubscription.user);
        Alert.alert('Success', data.cancelSubscription.message || 'Subscription cancelled');
      } else {
        Analytics.trackSubscriptionCancelFailed(data.cancelSubscription.message || 'Unknown error');
        Alert.alert('Error', data.cancelSubscription.message || 'Failed to cancel subscription');
      }
    },
    onError: (error: Error) => {
      Analytics.trackSubscriptionCancelFailed(error.message);
      Alert.alert('Error', error.message);
    },
  });

  const handleCancelSubscription = () => {
    Analytics.trackSubscriptionCancelStart();
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelSubscription() },
      ]
    );
  };

  const handleClearAnonymousSubscription = () => {
    Alert.alert(
      'Remove Subscription',
      'Are you sure you want to remove your anonymous subscription? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Remove', 
          style: 'destructive', 
          onPress: () => {
            clearAnonymousSubscription();
            Alert.alert('Success', 'Anonymous subscription removed');
          }
        },
      ]
    );
  };

  const handleLogout = () => {
    Analytics.trackLogout();
    logout();
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    const previousLanguage = i18n.language;
    i18n.changeLanguage(lang);
    Analytics.trackLanguageChange(lang, previousLanguage);
  };

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <LoginForm />
        {isAnonymousSubscribed && anonymousSubscription && (
          <View style={styles.anonymousSubscriptionContainer}>
            <ThemedText style={styles.anonymousSubscriptionTitle}>
              {'<debug> Anonymous Subscription Active'}
            </ThemedText>
            <ThemedText style={styles.anonymousSubscriptionPlan}>
              Plan: {anonymousSubscription.subscription.plan}
            </ThemedText>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: '#ff4444' }]}
              onPress={handleClearAnonymousSubscription}
            >
              <ThemedText style={[styles.cancelText, { color: '#ff4444' }]}>
                {'<debug> Remove Anonymous Subscription'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    );
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

        {user?.isCampyPlus && (
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: '#ff4444' }]}
            onPress={handleCancelSubscription}
            disabled={cancelLoading}
          >
            <ThemedText style={[styles.cancelText, { color: '#ff4444' }]}>
              {'<debug> Cancel Subscription'}
            </ThemedText>
          </TouchableOpacity>
        )}
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
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  anonymousSubscriptionContainer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 20,
  },
  anonymousSubscriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#ff9500',
  },
  anonymousSubscriptionPlan: {
    fontSize: 12,
    marginBottom: 12,
    opacity: 0.7,
  },
});
