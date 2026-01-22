import { useMutation } from '@apollo/client/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Analytics from '@/api/Analytics';
import Firebase from '@/api/Firebase';
import { LOGIN_MUTATION } from '@/api/graphql_queries';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAuthStore, type User } from '@/stores/authStore';

type LoginResponse = {
  login: {
    token: string;
    user: User;
  };
};

export function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('test@campy.app');
  const [password, setPassword] = useState('campy');
  const colorScheme = useColorScheme();
  const setUser = useAuthStore((state) => state.setUser);

  const [login, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.login;
      setUser(user, token);
      Firebase.setUser({ uid: user.uid, email: user.email });
      Analytics.trackLogin('email');
      Analytics.setUserProperties({
        is_premium: user.isCampyPlus,
      });
    },
    onError: (error) => {
      Alert.alert(t('login.loginFailed'), error.message);
      Analytics.trackLoginFailed(error.message, 'email');
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('login.validationError'));
      return;
    }
    login({ variables: { email, password } });
  };

  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {t('login.welcomeTitle')}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{t('login.welcomeSubtitle')}</ThemedText>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                color: colors.text,
              },
            ]}
            placeholder={t('login.emailPlaceholder')}
            placeholderTextColor={colors.icon}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                color: colors.text,
              },
            ]}
            placeholder={t('login.passwordPlaceholder')}
            placeholderTextColor={colors.icon}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>{t('common.signIn')}</ThemedText>
            )}
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.hint}>
          {t('login.hint')}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  form: {
    gap: 16,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    marginTop: 24,
    opacity: 0.5,
    fontSize: 14,
  },
});
