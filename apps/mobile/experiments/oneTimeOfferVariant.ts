import Firebase from '@/api/Firebase';

export function isOneTimeOfferVariant(): boolean {
    // Baseline/Control: ""  Variant B: "offer"
    return Firebase.getRemoteConfigString('offer') === 'offer';
}
