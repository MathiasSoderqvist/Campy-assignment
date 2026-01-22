import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SubscriptionPlan = 'MONTHLY' | 'YEARLY' | 'LIFETIME' | 'TRIAL';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'NONE';

export type Subscription = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  transactionId: string;
};

export type User = {
  uid: string;
  email: string;
  displayName: string | null;
  isCampyPlus: boolean;
  subscription: Subscription | null;
};

/**
 * Represents a subscription purchased by an anonymous (unauthenticated) user.
 * Stored locally and linked to a device ID until the user creates an account.
 */
export type AnonymousSubscription = {
  deviceId: string;
  subscription: Subscription;
  purchasedAt: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  deviceId: string | null;
  anonymousSubscription: AnonymousSubscription | null;
  setUser: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  setDeviceId: (deviceId: string) => void;
  setAnonymousSubscription: (subscription: AnonymousSubscription) => void;
  clearAnonymousSubscription: () => void;
  hasActiveAnonymousSubscription: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      deviceId: null,
      anonymousSubscription: null,
      setUser: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setDeviceId: (deviceId) => set({ deviceId }),
      setAnonymousSubscription: (anonymousSubscription) => set({ anonymousSubscription }),
      clearAnonymousSubscription: () => set({ anonymousSubscription: null }),
      hasActiveAnonymousSubscription: () => {
        const { anonymousSubscription } = get();
        if (!anonymousSubscription) return false;
        const { subscription } = anonymousSubscription;
        if (subscription.status !== 'ACTIVE') return false;
        if (subscription.plan === 'LIFETIME') return true;
        if (subscription.endDate && new Date(subscription.endDate) < new Date()) return false;
        return true;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
