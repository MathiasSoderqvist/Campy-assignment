import { RootStackParamList } from '@/navigation';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Dimensions,
    Platform,
    ToastAndroid,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SPACING = {
    s: 16,
    l: 24,
    gap: 20,
    ctaGap: 8,
};

export function OneTimeOfferPaywallScreen() {
    const insets = useSafeAreaInsets();

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const onClose = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            })
        );
    };


    const onClaim = () => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(
                '🎉 Discount applied! Enjoy Campy Plus.',
                ToastAndroid.SHORT
            );
        } else {
            Alert.alert(
                'Discount applied',
                '🎉 Enjoy Campy Plus!'
            );
        }
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            })
        );
    };

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.logoRow}>
                    <Image
                        source={require('../assets/images/campy-paywall.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>

                <Pressable
                    onPress={onClose}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                    hitSlop={10}
                    style={styles.closeButton}
                >
                    <Image
                        source={require('../assets/images/close-button.png')}
                        style={styles.closeImage}
                        resizeMode="contain"
                    />
                </Pressable>

            </View>

            {/* CONTENT */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HERO */}
                <View style={styles.heroWrap}>
                    {/* Replace with your asset */}
                    <Image
                        source={require('../assets/images/one-time-offer.png')}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />

                </View>

                {/* COPY */}
                <View style={styles.copy}>
                    <Text style={styles.title}>One-time offer: 50% off</Text>
                    <Text style={styles.body}>
                        Get Campy Plus for €14,98 instead of €29,99 for your first year.
                        This is the lowest price to buy Campy Plus.
                    </Text>
                </View>

                {/* CTA */}
                <View style={styles.ctaWrap}>
                    <Pressable onPress={onClaim} style={styles.ctaButton}>
                        <Text style={styles.ctaText}>Claim your one-time offer</Text>
                    </Pressable>

                    <Text style={styles.disclaimer}>Recurring billing. Cancel anytime.</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const CONTENT_WIDTH = SCREEN_WIDTH - SPACING.s * 2;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        height: 68,
        paddingHorizontal: SPACING.s,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    logoImage: {
        width: 140,
        height: 34,
    },

    logoText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#000',
    },
    closeButton: {
        width: 48,
        height: 48,
        borderRadius: 999,
        backgroundColor: 'rgba(242,245,247,1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeImage: {
        width: 48,
        height: 48,
    },

    scrollContent: {
        paddingTop: SPACING.s,
        paddingRight: SPACING.s,
        paddingBottom: SPACING.l,
        paddingLeft: SPACING.s,
        rowGap: SPACING.gap,
    },

    heroWrap: {
        width: CONTENT_WIDTH,
        height: 240,
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },

    copy: {
        width: CONTENT_WIDTH,
        alignSelf: 'center',
        rowGap: 6,
    },
    title: {
        fontSize: 24,
        lineHeight: 30,
        fontWeight: '700',
        color: '#000',
        letterSpacing: 0.33,
    },
    body: {
        fontSize: 17,
        lineHeight: 26,
        fontWeight: '400',
        color: '#000',
    },

    ctaWrap: {
        width: CONTENT_WIDTH,
        alignSelf: 'center',
        minHeight: 84,
        rowGap: SPACING.ctaGap,
    },
    ctaButton: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    disclaimer: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '400',
        color: 'rgba(51,51,51,1)',
        textAlign: 'center',
        opacity: 0.87,
    },
});
