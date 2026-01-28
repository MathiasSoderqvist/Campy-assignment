import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Analytics from '../api/Analytics';
import { CampyPlusContent } from '../components/CampyPlusContent';
import type { RootStackParamList } from '../navigation/types';

export function OneTimeOfferPaywallScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        Analytics.trackSubscriptionView('one_time_offer');
    }, []);

    const handleClose = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Temporary test screen before design */}
            <View style={styles.offerHeader}>
                <Text style={styles.badge}>ONE-TIME OFFER</Text>
                <Text style={styles.title}>50% off Campy Plus</Text>
                <Text style={styles.subtitle}>
                    This special discount is available once and won’t be shown again.
                </Text>
            </View>

            <CampyPlusContent onPurchaseSuccess={handleClose} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    offerHeader: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 8,
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#E8F0FF',
        color: '#2F6BFF',
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
        overflow: 'hidden',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});
