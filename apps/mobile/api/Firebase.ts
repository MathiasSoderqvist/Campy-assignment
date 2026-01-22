import analytics, {
  FirebaseAnalyticsTypes,
} from '@react-native-firebase/analytics';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import perf, { FirebasePerformanceTypes } from '@react-native-firebase/perf';
import remoteConfig from '@react-native-firebase/remote-config';
import { Platform } from 'react-native';

type AnalyticsEventParams = Record<string, string | number | boolean | null>;

class Firebase {
  static analytics: FirebaseAnalyticsTypes.Module;
  static auth: FirebaseAuthTypes.Module;
  static perf: FirebasePerformanceTypes.Module;
  static idToken: string | null = null;

  private static screenTraces: Map<
    string,
    FirebasePerformanceTypes.Trace | null
  > = new Map();
  private static customTraces: Map<
    string,
    FirebasePerformanceTypes.Trace | null
  > = new Map();

  static async init() {
    Firebase.auth = auth();
    Firebase.analytics = analytics();
    Firebase.perf = perf();

    // Start token refresh loop
    Firebase.refreshToken();
  }

  // Analytics tracking
  static track(eventName: string, params?: AnalyticsEventParams) {
    Firebase.analytics?.logEvent(eventName, params ?? {});
  }

  // Screen view tracking
  static trackScreenView(screenName: string, screenClass?: string) {
    Firebase.analytics?.logScreenView({
      screen_name: screenName,
      screen_class: screenClass ?? screenName,
    });
  }

  // User identity
  static async setUser(user: { uid: string; email?: string | null }) {
    await Firebase.analytics?.setUserId(user.uid);
    if (user.email) {
      await Firebase.analytics?.setUserProperty('email_domain', user.email.split('@')[1] ?? '');
    }
  }

  // Consent management
  static async setConsent(params: {
    analytics_storage?: boolean;
    ad_storage?: boolean;
    ad_user_data?: boolean;
    ad_personalization?: boolean;
  }) {
    await Firebase.analytics?.setConsent({
      analytics_storage: params.analytics_storage ?? false,
      ad_storage: params.ad_storage ?? false,
      ad_user_data: params.ad_user_data ?? false,
      ad_personalization: params.ad_personalization ?? false,
    });
  }

  // Performance tracing - screen traces (Android only)
  static async screenTrace(screenName: string) {
    if (Platform.OS !== 'android') return;

    try {
      const trace = await Firebase.perf?.newTrace(`screen_${screenName}`);
      await trace?.start();
      Firebase.screenTraces.set(screenName, trace ?? null);
    } catch (error) {
      console.warn('Failed to start screen trace:', error);
    }
  }

  static async stopScreenTrace(screenName: string) {
    if (Platform.OS !== 'android') return;

    try {
      const trace = Firebase.screenTraces.get(screenName);
      await trace?.stop();
      Firebase.screenTraces.delete(screenName);
    } catch (error) {
      console.warn('Failed to stop screen trace:', error);
    }
  }

  // Custom performance traces
  static async trace(traceName: string) {
    try {
      const trace = await Firebase.perf?.newTrace(traceName);
      await trace?.start();
      Firebase.customTraces.set(traceName, trace ?? null);
    } catch (error) {
      console.warn('Failed to start trace:', error);
    }
  }

  static async stopTrace(traceName: string) {
    try {
      const trace = Firebase.customTraces.get(traceName);
      await trace?.stop();
      Firebase.customTraces.delete(traceName);
    } catch (error) {
      console.warn('Failed to stop trace:', error);
    }
  }

  // Exception logging
  static logException(error: Error, fatal = false) {
    Firebase.track('exception_js', {
      message: error.message,
      stack: error.stack?.substring(0, 500) ?? '',
      fatal,
    });
  }

  static logNativeException(message: string, fatal = false) {
    Firebase.track('exception_native', {
      message,
      fatal,
    });
  }

  // Token refresh
  static async refreshToken() {
    try {
      const user = Firebase.auth?.currentUser;
      if (user) {
        Firebase.idToken = await user.getIdToken(true);
      }
    } catch (error) {
      console.warn('Failed to refresh ID token:', error);
    }

    // Refresh every 50 minutes (tokens expire at 60 minutes)
    setTimeout(() => Firebase.refreshToken(), 50 * 60 * 1000);
  }

  // Remote Config helpers
  static async fetchAndActivateRemoteConfig(cacheTime = 60 * 60) {
    try {
      await remoteConfig().fetch(cacheTime);
      await remoteConfig().activate();
      return true;
    } catch (error) {
      console.warn('Failed to fetch remote config:', error);
      return false;
    }
  }

  static getRemoteConfigValue(key: string) {
    return remoteConfig().getValue(key);
  }

  static getRemoteConfigString(key: string): string {
    return remoteConfig().getValue(key).asString();
  }

  static getRemoteConfigBoolean(key: string): boolean {
    return remoteConfig().getValue(key).asBoolean();
  }

  static getRemoteConfigNumber(key: string): number {
    return remoteConfig().getValue(key).asNumber();
  }
}

export default Firebase;
