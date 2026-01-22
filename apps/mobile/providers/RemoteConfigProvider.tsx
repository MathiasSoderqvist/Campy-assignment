import remoteConfig from '@react-native-firebase/remote-config';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// Remote Config types
export interface OnboardingConfig {
  showCampyPlusScreen: boolean;
  vehicleTypes: string[];
}

export interface FeatureFlagsConfig {
  enableOfflineMode: boolean;
  enablePremiumFeatures: boolean;
}

export interface RemoteConfigAPI {
  activated: boolean;
  onboardingConfig: OnboardingConfig;
  featureFlags: FeatureFlagsConfig;
}

// Default values
const defaultOnboardingConfig: OnboardingConfig = {
  showCampyPlusScreen: true,
  vehicleTypes: ['motorhome', 'rooftent', 'bicycle', 'car', 'van'],
};

const defaultFeatureFlags: FeatureFlagsConfig = {
  enableOfflineMode: false,
  enablePremiumFeatures: false,
};

const defaultRemoteConfig: RemoteConfigAPI = {
  activated: false,
  onboardingConfig: defaultOnboardingConfig,
  featureFlags: defaultFeatureFlags,
};

export const RemoteConfigContext =
  createContext<RemoteConfigAPI>(defaultRemoteConfig);

interface RemoteConfigProviderProps {
  children: ReactNode;
}

export function RemoteConfigProvider({ children }: RemoteConfigProviderProps) {
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const initRemoteConfig = async () => {
      try {
        // Set defaults for all config keys
        await remoteConfig().setDefaults({
          onboarding_config: JSON.stringify(defaultOnboardingConfig),
          feature_flags: JSON.stringify(defaultFeatureFlags),
        });

        // Fetch and activate with 1 hour cache
        await remoteConfig().fetch(60 * 60);
        await remoteConfig().activate();

        // Mark as activated even if fetchAndActivate returns false on Android
        setActivated(true);
      } catch (error) {
        console.warn('Remote config fetch failed, using defaults:', error);
        // Still mark as activated to use defaults
        setActivated(true);
      }
    };

    initRemoteConfig();
  }, []);

  // Parse config values with memoization
  const onboardingConfig = useMemo(() => {
    if (!activated) return defaultOnboardingConfig;
    try {
      const value = remoteConfig().getValue('onboarding_config').asString();
      return value ? JSON.parse(value) : defaultOnboardingConfig;
    } catch {
      return defaultOnboardingConfig;
    }
  }, [activated]);

  const featureFlags = useMemo(() => {
    if (!activated) return defaultFeatureFlags;
    try {
      const value = remoteConfig().getValue('feature_flags').asString();
      return value ? JSON.parse(value) : defaultFeatureFlags;
    } catch {
      return defaultFeatureFlags;
    }
  }, [activated]);

  const value = useMemo<RemoteConfigAPI>(
    () => ({
      activated,
      onboardingConfig,
      featureFlags,
    }),
    [activated, onboardingConfig, featureFlags]
  );

  return (
    <RemoteConfigContext.Provider value={value}>
      {children}
    </RemoteConfigContext.Provider>
  );
}

export function useRemoteConfig() {
  return useContext(RemoteConfigContext);
}
