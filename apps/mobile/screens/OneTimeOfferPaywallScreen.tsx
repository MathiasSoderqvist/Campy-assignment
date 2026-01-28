import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// If your design tokens exist, replace these constants with your tokens.
const SPACING = {
    s: 16,  // Spacing/spacing-s (guess; swap to your token)
    l: 24,  // Spacing/spacing-l
    gap: 20,
    ctaGap: 8,
};

export function OneTimeOfferPaywallScreen() {
    const insets = useSafeAreaInsets();

    const onClose = () => {
        // navigation.goBack() / dismiss modal
    };

    const onClaim = () => {
        // purchase flow
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

    // Header matches: height 68, justify space-between, padding horizontal spacing-s
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
        backgroundColor: 'rgba(242,245,247,1)', // matches your “background/button” swatch
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeImage: {
        width: 48,
        height: 48,
    },

    // Scrollview matches your padding + gap
    scrollContent: {
        paddingTop: SPACING.s,
        paddingRight: SPACING.s,
        paddingBottom: SPACING.l,
        paddingLeft: SPACING.s,
        rowGap: SPACING.gap, // gap: 20px
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
        lineHeight: 30, // 125% approx from your screenshot
        fontWeight: '700',
        color: '#000',
        letterSpacing: 0.33,
    },
    body: {
        fontSize: 17,
        lineHeight: 26, // 150%
        fontWeight: '400',
        color: '#000',
    },

    // CTA block matches: width 374, height 84, gap 8
    ctaWrap: {
        width: CONTENT_WIDTH,
        alignSelf: 'center',
        minHeight: 84,
        rowGap: SPACING.ctaGap,
    },
    ctaButton: {
        width: '100%',
        height: 56, // your button “Fixed (56px)”
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
        color: 'rgba(51,51,51,1)', // your “color/text-body”
        textAlign: 'center',
        opacity: 0.87, // you noted 87%
    },
});
