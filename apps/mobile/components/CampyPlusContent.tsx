import { useMutation } from '@apollo/client/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Analytics from '../api/Analytics';
import { PURCHASE_SUBSCRIPTION_MUTATION } from '../api/graphql_queries';
import { SubscriptionPlan as SubscriptionPlanType, useAuthStore, User } from '../stores/authStore';

type PurchaseSubscriptionData = {
  purchaseSubscription: {
    success: boolean;
    message: string;
    user: User;
  };
};

type SubscriptionPlanOption = {
  id: string;
  planType: SubscriptionPlanType;
  nameKey: string;
  price: string;
  periodKey: string;
  popular?: boolean;
};

const SUBSCRIPTION_PLANS: SubscriptionPlanOption[] = [
  { id: 'monthly', planType: 'MONTHLY', nameKey: 'campyPlus.plans.monthly', price: '€9.99', periodKey: 'campyPlus.plans.perMonth' },
  { id: 'yearly', planType: 'YEARLY', nameKey: 'campyPlus.plans.yearly', price: '€79.99', periodKey: 'campyPlus.plans.perYear', popular: true },
  { id: 'lifetime', planType: 'LIFETIME', nameKey: 'campyPlus.plans.lifetime', price: '€199.99', periodKey: 'campyPlus.plans.oneTime' },
];

const PLUS_FEATURE_KEYS = [
  'campyPlus.features.unlimitedLocations',
  'campyPlus.features.offlineMaps',
  'campyPlus.features.adFree',
  'campyPlus.features.exclusiveCampsites',
  'campyPlus.features.prioritySupport',
  'campyPlus.features.earlyAccess',
];

type CampyPlusContentProps = {
  onPurchaseSuccess?: () => void;
};

export function CampyPlusContent({ onPurchaseSuccess }: CampyPlusContentProps) {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const updateUser = useAuthStore((state) => state.updateUser);
  const user = useAuthStore((state) => state.user);

  const [purchaseSubscription, { loading }] = useMutation<PurchaseSubscriptionData>(PURCHASE_SUBSCRIPTION_MUTATION, {
    onCompleted: (data: PurchaseSubscriptionData) => {
      if (data.purchaseSubscription.success) {
        const plan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan);
        Analytics.trackSubscriptionPurchaseSuccess({
          plan_id: selectedPlan,
          plan_type: plan?.planType ?? 'MONTHLY',
          price: plan?.price,
        });
        updateUser(data.purchaseSubscription.user);
        Alert.alert(
          t('campyPlus.purchaseSuccess'),
          data.purchaseSubscription.message,
          [{ text: 'OK', onPress: onPurchaseSuccess }]
        );
      } else {
        Analytics.trackSubscriptionPurchaseFailed(selectedPlan, data.purchaseSubscription.message);
        Alert.alert(t('campyPlus.purchaseError'), data.purchaseSubscription.message);
      }
    },
    onError: (error: Error) => {
      Analytics.trackSubscriptionPurchaseFailed(selectedPlan, error.message);
      Alert.alert(t('campyPlus.purchaseError'), error.message);
    },
  });

  const handlePlanSelect = (planId: string) => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (plan) {
      Analytics.trackSubscriptionPlanSelect({
        plan_id: planId,
        plan_type: plan.planType,
        price: plan.price,
      });
    }
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan);
    if (!plan) return;

    Analytics.trackSubscriptionPurchaseStart({
      plan_id: selectedPlan,
      plan_type: plan.planType,
      price: plan.price,
    });

    // In production, this would be the actual receipt from App Store/Play Store
    // For demo purposes, we use a mock receipt
    const mockReceipt = `mock_receipt_${Date.now()}_${plan.planType}`;

    await purchaseSubscription({
      variables: {
        plan: plan.planType,
        receipt: mockReceipt,
      },
    });
  };

  // If user already has Campy Plus, show different content
  if (user?.isCampyPlus) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('campyPlus.alreadySubscribed')}</Text>
        <Text style={styles.description}>
          {t('campyPlus.thankYou')}
        </Text>
        {user.subscription && (
          <View style={styles.subscriptionInfo}>
            <Text style={styles.subscriptionLabel}>{t('campyPlus.currentPlan')}</Text>
            <Text style={styles.subscriptionValue}>{user.subscription.plan}</Text>
            {user.subscription.endDate && (
              <>
                <Text style={styles.subscriptionLabel}>{t('campyPlus.validUntil')}</Text>
                <Text style={styles.subscriptionValue}>
                  {new Date(user.subscription.endDate).toLocaleDateString()}
                </Text>
              </>
            )}
          </View>
        )}
      </ScrollView>
    );
  }

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
          <TouchableOpacity
            key={plan.id}
            activeOpacity={0.7}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
            ]}
            onPress={() => handlePlanSelect(plan.id)}
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
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.subscribeButton, loading && styles.subscribeButtonDisabled]}
        onPress={handleSubscribe}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.subscribeButtonText}>{t('campyPlus.subscribeNow')}</Text>
        )}
      </TouchableOpacity>

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
  subscribeButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  subscriptionInfo: {
    marginTop: 32,
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 20,
  },
  subscriptionLabel: {
    fontSize: 14,
    color: '#687076',
    marginTop: 8,
  },
  subscriptionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    marginTop: 4,
  },
});
