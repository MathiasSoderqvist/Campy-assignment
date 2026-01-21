import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type VehicleType = 'motorhome' | 'rooftent' | 'bicycle' | 'car' | 'van';

type OnboardingState = {
  isOnboardingCompleted: boolean;
  vehicleType: VehicleType | null;
  setVehicleType: (type: VehicleType) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isOnboardingCompleted: false,
      vehicleType: null,
      setVehicleType: (type) => set({ vehicleType: type }),
      completeOnboarding: () => set({ isOnboardingCompleted: true }),
      resetOnboarding: () => set({ isOnboardingCompleted: false, vehicleType: null }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
