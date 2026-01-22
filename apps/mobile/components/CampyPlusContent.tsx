import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type SubscriptionPlan = {
  id: string;
  nameKey: string;
  price: string;
  periodKey: string;
  popular?: boolean;
};

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: 'monthly', nameKey: 'campyPlus.plans.monthly', price: '€9.99', periodKey: 'campyPlus.plans.perMonth' },
  { id: 'yearly', nameKey: 'campyPlus.plans.yearly', price: '€79.99', periodKey: 'campyPlus.plans.perYear', popular: true },
  { id: 'lifetime', nameKey: 'campyPlus.plans.lifetime', price: '€199.99', periodKey: 'campyPlus.plans.oneTime' },
];

const PLUS_FEATURE_KEYS = [
  'campyPlus.features.unlimitedLocations',
  'campyPlus.features.offlineMaps',
  'campyPlus.features.adFree',
  'campyPlus.features.exclusiveCampsites',
  'campyPlus.features.prioritySupport',
  'campyPlus.features.earlyAccess',
];

export function CampyPlusContent() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{t('campyPlus.title')}</Text>
      <Text style={styles.description}>
        {t('campyPlus.description')}
      </Text>

      <View style={styles.featuresContainer}>
        {PLUS_FEATURE_KEYS.map((featureKey, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>{t(featureKey)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.plansTitle}>{t('campyPlus.choosePlan')}</Text>

      <View style={styles.plansContainer}>
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Pressable
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>{t('campyPlus.mostPopular')}</Text>
              </View>
            )}
            <Text
              style={[
                styles.planName,
                selectedPlan === plan.id && styles.planNameSelected,
              ]}
            >
              {t(plan.nameKey)}
            </Text>
            <View style={styles.priceRow}>
              <Text
                style={[
                  styles.planPrice,
                  selectedPlan === plan.id && styles.planPriceSelected,
                ]}
              >
                {plan.price}
              </Text>
              <Text
                style={[
                  styles.planPeriod,
                  selectedPlan === plan.id && styles.planPeriodSelected,
                ]}
              >
                {t(plan.periodKey)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.subscribeButton}>
        <Text style={styles.subscribeButtonText}>{t('campyPlus.subscribeNow')}</Text>
      </Pressable>

      <Text style={styles.termsText}>
        {t('campyPlus.terms')}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#11181C',
    textAlign: 'center',
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    color: '#687076',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  featuresContainer: {
    marginTop: 32,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkmark: {
    fontSize: 18,
    color: '#34C759',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 16,
    color: '#11181C',
  },
  plansTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#11181C',
    marginTop: 32,
    marginBottom: 16,
  },
  plansContainer: {
    gap: 12,
  },
  planCard: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F7FF',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
  },
  planNameSelected: {
    color: '#007AFF',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
  },
  planPriceSelected: {
    color: '#007AFF',
  },
  planPeriod: {
    fontSize: 14,
    color: '#687076',
    marginLeft: 4,
  },
  planPeriodSelected: {
    color: '#007AFF',
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 32,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  termsText: {
    fontSize: 12,
    color: '#687076',
    textAlign: 'center',
    marginTop: 16,
  },
});
