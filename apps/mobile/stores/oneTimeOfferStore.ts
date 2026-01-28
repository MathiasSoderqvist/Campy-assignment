import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type OneTimeOfferState = {
    paywallCloseCount: number;
    offerShown: boolean;
    promoCodeUsed: boolean;

    incrementEligibleClose: () => number;
    markOfferShown: () => void;
    markPromoCodeUsed: () => void;
    resetForDebug: () => void;
};

export const useOneTimeOfferStore = create<OneTimeOfferState>()(
    persist(
        (set, get) => ({
            paywallCloseCount: 0,
            offerShown: false,
            promoCodeUsed: false,

            incrementEligibleClose() {
                const next = get().paywallCloseCount + 1;
                set({ paywallCloseCount: next });
                return next;
            },

            markOfferShown() {
                set({ offerShown: true });
            },

            markPromoCodeUsed() {
                set({ promoCodeUsed: true });
            },

            resetForDebug() {
                set({ paywallCloseCount: 0, offerShown: false, promoCodeUsed: false });
            },
        }),
        {
            name: 'one-time-offer-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
