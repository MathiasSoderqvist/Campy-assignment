import { useOneTimeOfferStore } from '@/stores/oneTimeOfferStore';
import { isOneTimeOfferVariant } from './oneTimeOfferVariant';

type Params = {
    // Pass false for Trips/Navigation paywalls
    isEligiblePaywall: boolean;

    // “Not for existing users”
    isExistingUser: boolean;

    // Navigation callback to show the offer screen
    showOffer: () => void;
};

export function onPaywallClosed({ isEligiblePaywall, isExistingUser, showOffer }: Params): boolean {
    const store = useOneTimeOfferStore.getState();

    if (!isEligiblePaywall) return false;
    if (isExistingUser) return false;
    if (store.promoCodeUsed) return false;

    if (!isOneTimeOfferVariant()) return false;
    if (store.offerShown) return false;

    const closeCount = store.incrementEligibleClose();
    console.log('[Offer] closeCount after increment =', closeCount);

    if (closeCount === 2) {
        store.markOfferShown();
        showOffer();
        return true;
    }

    return false;
}

