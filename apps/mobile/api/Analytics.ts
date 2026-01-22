/**
 * Comprehensive Analytics Module for Campy Mobile App
 *
 * This module provides type-safe analytics tracking for all user interactions.
 * All events are sent to Firebase Analytics.
 */

import Firebase from './Firebase';

// ============================================================================
// Event Types & Parameters
// ============================================================================

/**
 * Standard event parameters used across multiple events
 */
export type StandardEventParams = {
  timestamp?: number;
  session_id?: string;
};

/**
 * Location-related event parameters
 */
export type LocationEventParams = {
  location_id: string;
  location_name?: string;
  location_rating?: number;
  location_latitude?: number;
  location_longitude?: number;
};

/**
 * Subscription-related event parameters
 */
export type SubscriptionEventParams = {
  plan_id: string;
  plan_type: 'MONTHLY' | 'YEARLY' | 'LIFETIME' | 'TRIAL';
  price?: string;
  currency?: string;
  is_anonymous?: boolean;
  is_trial?: boolean;
};

/**
 * Onboarding-related event parameters
 */
export type OnboardingEventParams = {
  step: string;
  step_number?: number;
  total_steps?: number;
};

/**
 * Search/Filter event parameters
 */
export type SearchEventParams = {
  search_term?: string;
  filters_applied?: string;
  results_count?: number;
  latitude?: number;
  longitude?: number;
  radius_km?: number;
};

// ============================================================================
// Event Definitions
// ============================================================================

/**
 * All analytics events in the app with their parameter types
 */
export const AnalyticsEvents = {
  // -------------------------------------------------------------------------
  // Authentication Events
  // -------------------------------------------------------------------------
  LOGIN: 'login',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  SIGNUP_FAILED: 'signup_failed',
  PASSWORD_RESET_REQUEST: 'password_reset_request',

  // -------------------------------------------------------------------------
  // Screen View Events (automatically tracked, but can be manually triggered)
  // -------------------------------------------------------------------------
  SCREEN_VIEW: 'screen_view',

  // -------------------------------------------------------------------------
  // Map Events
  // -------------------------------------------------------------------------
  MAP_LOADED: 'map_loaded',
  MAP_MARKER_CLICK: 'map_marker_click',
  MAP_REGION_CHANGED: 'map_region_changed',
  MAP_MY_LOCATION_CLICK: 'map_my_location_click',

  // -------------------------------------------------------------------------
  // Location Events
  // -------------------------------------------------------------------------
  LOCATION_VIEW: 'location_view',
  LOCATION_SHARE: 'location_share',
  LOCATION_DIRECTIONS: 'location_directions',

  // -------------------------------------------------------------------------
  // Favorites Events
  // -------------------------------------------------------------------------
  FAVORITE_ADD: 'favorite_add',
  FAVORITE_REMOVE: 'favorite_remove',
  FAVORITES_VIEW: 'favorites_view',

  // -------------------------------------------------------------------------
  // Search Events
  // -------------------------------------------------------------------------
  SEARCH_PERFORMED: 'search_performed',
  SEARCH_RESULTS_VIEW: 'search_results_view',
  FILTER_APPLIED: 'filter_applied',

  // -------------------------------------------------------------------------
  // Subscription/Campy+ Events
  // -------------------------------------------------------------------------
  SUBSCRIPTION_VIEW: 'subscription_view',
  SUBSCRIPTION_PLAN_SELECT: 'subscription_plan_select',
  SUBSCRIPTION_PURCHASE_START: 'subscription_purchase_start',
  SUBSCRIPTION_PURCHASE_SUCCESS: 'subscription_purchase_success',
  SUBSCRIPTION_PURCHASE_FAILED: 'subscription_purchase_failed',
  SUBSCRIPTION_CANCEL_START: 'subscription_cancel_start',
  SUBSCRIPTION_CANCEL_SUCCESS: 'subscription_cancel_success',
  SUBSCRIPTION_CANCEL_FAILED: 'subscription_cancel_failed',
  SUBSCRIPTION_LINKED: 'subscription_linked',

  // -------------------------------------------------------------------------
  // Onboarding Events
  // -------------------------------------------------------------------------
  ONBOARDING_START: 'onboarding_start',
  ONBOARDING_STEP_VIEW: 'onboarding_step_view',
  ONBOARDING_STEP_COMPLETE: 'onboarding_step_complete',
  ONBOARDING_SKIP: 'onboarding_skip',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  VEHICLE_TYPE_SELECT: 'vehicle_type_select',

  // -------------------------------------------------------------------------
  // Settings Events
  // -------------------------------------------------------------------------
  LANGUAGE_CHANGE: 'language_change',
  THEME_CHANGE: 'theme_change',
  NOTIFICATIONS_TOGGLE: 'notifications_toggle',

  // -------------------------------------------------------------------------
  // Trips Events
  // -------------------------------------------------------------------------
  TRIP_CREATE: 'trip_create',
  TRIP_VIEW: 'trip_view',
  TRIP_EDIT: 'trip_edit',
  TRIP_DELETE: 'trip_delete',
  TRIP_SHARE: 'trip_share',

  // -------------------------------------------------------------------------
  // Error Events
  // -------------------------------------------------------------------------
  ERROR_DISPLAYED: 'error_displayed',
  API_ERROR: 'api_error',

  // -------------------------------------------------------------------------
  // Engagement Events
  // -------------------------------------------------------------------------
  APP_OPEN: 'app_open',
  APP_BACKGROUND: 'app_background',
  DEEP_LINK_OPEN: 'deep_link_open',
  PUSH_NOTIFICATION_OPEN: 'push_notification_open',
  SHARE_ACTION: 'share_action',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

// ============================================================================
// Analytics Class
// ============================================================================

class Analytics {
  private static isEnabled = true;

  /**
   * Enable or disable analytics tracking
   */
  static setEnabled(enabled: boolean) {
    Analytics.isEnabled = enabled;
  }

  /**
   * Generic track event method
   */
  static track(eventName: string, params?: Record<string, string | number | boolean | null>) {
    if (!Analytics.isEnabled) return;

    const enrichedParams = {
      ...params,
      timestamp: Date.now(),
    };

    Firebase.track(eventName, enrichedParams);

    // Debug logging in development
    if (__DEV__) {
      console.log(`[Analytics] ${eventName}`, enrichedParams);
    }
  }

  // -------------------------------------------------------------------------
  // Authentication Tracking
  // -------------------------------------------------------------------------

  static trackLogin(method: string) {
    Analytics.track(AnalyticsEvents.LOGIN, { method });
  }

  static trackLoginFailed(error: string, method?: string) {
    Analytics.track(AnalyticsEvents.LOGIN_FAILED, {
      error: error.substring(0, 100),
      method: method ?? 'email',
    });
  }

  static trackLogout() {
    Analytics.track(AnalyticsEvents.LOGOUT);
  }

  static trackSignup(method: string) {
    Analytics.track(AnalyticsEvents.SIGNUP, { method });
  }

  static trackSignupFailed(error: string) {
    Analytics.track(AnalyticsEvents.SIGNUP_FAILED, {
      error: error.substring(0, 100),
    });
  }

  // -------------------------------------------------------------------------
  // Map Tracking
  // -------------------------------------------------------------------------

  static trackMapLoaded(locationsCount: number) {
    Analytics.track(AnalyticsEvents.MAP_LOADED, {
      locations_count: locationsCount,
    });
  }

  static trackMapMarkerClick(params: LocationEventParams) {
    Analytics.track(AnalyticsEvents.MAP_MARKER_CLICK, {
      location_id: params.location_id,
      location_name: params.location_name ?? '',
      location_rating: params.location_rating ?? 0,
    });
  }

  static trackMapRegionChanged(latitude: number, longitude: number, zoom?: number) {
    Analytics.track(AnalyticsEvents.MAP_REGION_CHANGED, {
      latitude,
      longitude,
      zoom: zoom ?? 0,
    });
  }

  static trackMyLocationClick() {
    Analytics.track(AnalyticsEvents.MAP_MY_LOCATION_CLICK);
  }

  // -------------------------------------------------------------------------
  // Location Tracking
  // -------------------------------------------------------------------------

  static trackLocationView(params: LocationEventParams) {
    Analytics.track(AnalyticsEvents.LOCATION_VIEW, {
      location_id: params.location_id,
      location_name: params.location_name ?? '',
      location_rating: params.location_rating ?? 0,
    });
  }

  static trackLocationShare(locationId: string, method?: string) {
    Analytics.track(AnalyticsEvents.LOCATION_SHARE, {
      location_id: locationId,
      share_method: method ?? 'unknown',
    });
  }

  static trackLocationDirections(locationId: string, provider?: string) {
    Analytics.track(AnalyticsEvents.LOCATION_DIRECTIONS, {
      location_id: locationId,
      provider: provider ?? 'default',
    });
  }

  // -------------------------------------------------------------------------
  // Favorites Tracking
  // -------------------------------------------------------------------------

  static trackFavoriteAdd(params: LocationEventParams) {
    Analytics.track(AnalyticsEvents.FAVORITE_ADD, {
      location_id: params.location_id,
      location_name: params.location_name ?? '',
    });
  }

  static trackFavoriteRemove(locationId: string, locationName?: string) {
    Analytics.track(AnalyticsEvents.FAVORITE_REMOVE, {
      location_id: locationId,
      location_name: locationName ?? '',
    });
  }

  static trackFavoritesView(favoritesCount: number) {
    Analytics.track(AnalyticsEvents.FAVORITES_VIEW, {
      favorites_count: favoritesCount,
    });
  }

  // -------------------------------------------------------------------------
  // Search Tracking
  // -------------------------------------------------------------------------

  static trackSearchPerformed(params: SearchEventParams) {
    Analytics.track(AnalyticsEvents.SEARCH_PERFORMED, {
      search_term: params.search_term ?? '',
      latitude: params.latitude ?? 0,
      longitude: params.longitude ?? 0,
      radius_km: params.radius_km ?? 0,
    });
  }

  static trackSearchResults(resultsCount: number, searchTerm?: string) {
    Analytics.track(AnalyticsEvents.SEARCH_RESULTS_VIEW, {
      results_count: resultsCount,
      search_term: searchTerm ?? '',
    });
  }

  static trackFilterApplied(filterType: string, filterValue: string) {
    Analytics.track(AnalyticsEvents.FILTER_APPLIED, {
      filter_type: filterType,
      filter_value: filterValue,
    });
  }

  // -------------------------------------------------------------------------
  // Subscription Tracking
  // -------------------------------------------------------------------------

  static trackSubscriptionView(source: 'home' | 'onboarding' | 'profile' | 'paywall') {
    Analytics.track(AnalyticsEvents.SUBSCRIPTION_VIEW, { source });
  }

  static trackSubscriptionPlanSelect(params: SubscriptionEventParams) {
    Analytics.track(AnalyticsEvents.SUBSCRIPTION_PLAN_SELECT, {
      plan_id: params.plan_id,
      plan_type: params.plan_type,
      price: params.price ?? '',
    });
  }

  static trackSubscriptionPurchaseStart(params: SubscriptionEventParams) {
    Analytics.track(AnalyticsEvents.SUBSCRIPTION_PURCHASE_START, {
      plan_id: params.plan_id,
      plan_type: params.plan_type,
      price: params.price ?? '',
      is_anonymous: params.is_anonymous ?? false,
      is_trial: params.is_trial ?? false,
    });
  }

  static trackSubscriptionPurchaseSuccess(params: SubscriptionEventParams) {
    Analytics.track(AnalyticsEvents.SUBSCRIPTION_PURCHASE_SUCCESS, {
      plan_id: params.plan_id,
      plan_type: params.plan_type,
      price: params.price ?? '',
      is_anonymous: params.is_anonymous ?? false,
      is_trial: params.is_trial ?? false,
    });
  }

  static trackSubscriptionPurchaseFailed(planId: string, error: string) {
    Analytics.track(AnalyticsEvents.SUBSCRIPTION_PURCHASE_FAILED, {
      plan_id: planId,
      error: error.substring(0, 100),
    });
  }

  static trackSubscriptionCancelStart() {
    Analytics.track(AnalyticsEvents.SUBSCRIPTION_CANCEL_START);
  }

  static trackSubscriptionCancelSuccess() {
    Analytics.track(AnalyticsEvents.SUBSCRIPTION_CANCEL_SUCCESS);
  }

  static trackSubscriptionCancelFailed(error: string) {
    Analytics.track(AnalyticsEvents.SUBSCRIPTION_CANCEL_FAILED, {
      error: error.substring(0, 100),
    });
  }

  static trackSubscriptionLinked(method: 'login' | 'manual') {
    Analytics.track(AnalyticsEvents.SUBSCRIPTION_LINKED, { method });
  }

  /**
   * Generic event tracking for custom events
   */
  static trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
    Analytics.track(eventName, params);
  }

  // -------------------------------------------------------------------------
  // Onboarding Tracking
  // -------------------------------------------------------------------------

  static trackOnboardingStart() {
    Analytics.track(AnalyticsEvents.ONBOARDING_START);
  }

  static trackOnboardingStepView(step: string, stepNumber: number, totalSteps: number) {
    Analytics.track(AnalyticsEvents.ONBOARDING_STEP_VIEW, {
      step,
      step_number: stepNumber,
      total_steps: totalSteps,
    });
  }

  static trackOnboardingStepComplete(step: string, stepNumber: number) {
    Analytics.track(AnalyticsEvents.ONBOARDING_STEP_COMPLETE, {
      step,
      step_number: stepNumber,
    });
  }

  static trackOnboardingSkip(step: string, stepNumber: number) {
    Analytics.track(AnalyticsEvents.ONBOARDING_SKIP, {
      step,
      step_number: stepNumber,
    });
  }

  static trackOnboardingComplete(vehicleType?: string) {
    Analytics.track(AnalyticsEvents.ONBOARDING_COMPLETE, {
      vehicle_type: vehicleType ?? 'not_selected',
    });
  }

  static trackVehicleTypeSelect(vehicleType: string) {
    Analytics.track(AnalyticsEvents.VEHICLE_TYPE_SELECT, {
      vehicle_type: vehicleType,
    });
  }

  // -------------------------------------------------------------------------
  // Settings Tracking
  // -------------------------------------------------------------------------

  static trackLanguageChange(language: string, previousLanguage?: string) {
    Analytics.track(AnalyticsEvents.LANGUAGE_CHANGE, {
      language,
      previous_language: previousLanguage ?? '',
    });
  }

  static trackThemeChange(theme: 'light' | 'dark' | 'system') {
    Analytics.track(AnalyticsEvents.THEME_CHANGE, { theme });
  }

  static trackNotificationsToggle(enabled: boolean) {
    Analytics.track(AnalyticsEvents.NOTIFICATIONS_TOGGLE, { enabled });
  }

  // -------------------------------------------------------------------------
  // Trips Tracking
  // -------------------------------------------------------------------------

  static trackTripCreate(tripId: string, locationsCount: number) {
    Analytics.track(AnalyticsEvents.TRIP_CREATE, {
      trip_id: tripId,
      locations_count: locationsCount,
    });
  }

  static trackTripView(tripId: string) {
    Analytics.track(AnalyticsEvents.TRIP_VIEW, { trip_id: tripId });
  }

  static trackTripEdit(tripId: string) {
    Analytics.track(AnalyticsEvents.TRIP_EDIT, { trip_id: tripId });
  }

  static trackTripDelete(tripId: string) {
    Analytics.track(AnalyticsEvents.TRIP_DELETE, { trip_id: tripId });
  }

  static trackTripShare(tripId: string, method?: string) {
    Analytics.track(AnalyticsEvents.TRIP_SHARE, {
      trip_id: tripId,
      share_method: method ?? 'unknown',
    });
  }

  // -------------------------------------------------------------------------
  // Error Tracking
  // -------------------------------------------------------------------------

  static trackErrorDisplayed(errorType: string, errorMessage: string, screen?: string) {
    Analytics.track(AnalyticsEvents.ERROR_DISPLAYED, {
      error_type: errorType,
      error_message: errorMessage.substring(0, 100),
      screen: screen ?? '',
    });
  }

  static trackApiError(endpoint: string, statusCode: number, errorMessage: string) {
    Analytics.track(AnalyticsEvents.API_ERROR, {
      endpoint,
      status_code: statusCode,
      error_message: errorMessage.substring(0, 100),
    });
  }

  // -------------------------------------------------------------------------
  // Engagement Tracking
  // -------------------------------------------------------------------------

  static trackAppOpen(source?: string) {
    Analytics.track(AnalyticsEvents.APP_OPEN, {
      source: source ?? 'direct',
    });
  }

  static trackAppBackground() {
    Analytics.track(AnalyticsEvents.APP_BACKGROUND);
  }

  static trackDeepLinkOpen(url: string, screen?: string) {
    Analytics.track(AnalyticsEvents.DEEP_LINK_OPEN, {
      url: url.substring(0, 200),
      screen: screen ?? '',
    });
  }

  static trackPushNotificationOpen(notificationId: string, campaignId?: string) {
    Analytics.track(AnalyticsEvents.PUSH_NOTIFICATION_OPEN, {
      notification_id: notificationId,
      campaign_id: campaignId ?? '',
    });
  }

  static trackShareAction(contentType: string, method?: string) {
    Analytics.track(AnalyticsEvents.SHARE_ACTION, {
      content_type: contentType,
      share_method: method ?? 'unknown',
    });
  }

  // -------------------------------------------------------------------------
  // User Properties
  // -------------------------------------------------------------------------

  static setUserProperties(properties: {
    is_premium?: boolean;
    vehicle_type?: string;
    language?: string;
    favorites_count?: number;
  }) {
    // These would be set as user properties in Firebase
    if (properties.is_premium !== undefined) {
      Firebase.track('user_property_set', { property: 'is_premium', value: properties.is_premium });
    }
    if (properties.vehicle_type) {
      Firebase.track('user_property_set', { property: 'vehicle_type', value: properties.vehicle_type });
    }
    if (properties.language) {
      Firebase.track('user_property_set', { property: 'language', value: properties.language });
    }
    if (properties.favorites_count !== undefined) {
      Firebase.track('user_property_set', { property: 'favorites_count', value: properties.favorites_count });
    }
  }
}

export default Analytics;
