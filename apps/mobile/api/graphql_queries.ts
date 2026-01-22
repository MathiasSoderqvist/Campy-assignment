import { gql } from "@apollo/client/core";

const LOCATION_FRAGMENT = gql`
  fragment LocationFragment on Location {
    uid
    title
    address
    latitude
    longitude
    description
    imageUrl
    rating
    reviewCount
  }
`;

const SUBSCRIPTION_FRAGMENT = gql`
  fragment SubscriptionFragment on Subscription {
    plan
    status
    startDate
    endDate
    autoRenew
    transactionId
  }
`;

const USER_FRAGMENT = gql`
  ${SUBSCRIPTION_FRAGMENT}
  fragment UserFragment on User {
    uid
    email
    displayName
    isCampyPlus
    subscription {
      ...SubscriptionFragment
    }
  }
`;

export const FETCH_LOCATIONS_NEARBY = gql`
  ${LOCATION_FRAGMENT}
  query LocationsNearby($latitude: Float!, $longitude: Float!, $radiusKm: Float) {
    locations: locationsNearby(latitude: $latitude, longitude: $longitude, radiusKm: $radiusKm) {
      ...LocationFragment
    }
  }
`;

export const FETCH_ME = gql`
  ${USER_FRAGMENT}
  query Me {
    me {
      ...UserFragment
    }
  }
`;

export const LOGIN_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation Login($email: String!, $password: String!, $deviceId: String) {
    login(email: $email, password: $password, deviceId: $deviceId) {
      token
      user {
        ...UserFragment
      }
      linkedSubscription
    }
  }
`;

export const PURCHASE_SUBSCRIPTION_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation PurchaseSubscription($plan: SubscriptionPlan!, $receipt: String!) {
    purchaseSubscription(plan: $plan, receipt: $receipt) {
      success
      message
      user {
        ...UserFragment
      }
    }
  }
`;

export const CANCEL_SUBSCRIPTION_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation CancelSubscription {
    cancelSubscription {
      success
      message
      user {
        ...UserFragment
      }
    }
  }
`;

export const RESTORE_PURCHASES_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation RestorePurchases($receipt: String!) {
    restorePurchases(receipt: $receipt) {
      success
      message
      user {
        ...UserFragment
      }
    }
  }
`;

export const PURCHASE_SUBSCRIPTION_ANONYMOUS_MUTATION = gql`
  ${SUBSCRIPTION_FRAGMENT}
  mutation PurchaseSubscriptionAnonymous($plan: SubscriptionPlan!, $receipt: String!, $deviceId: String!) {
    purchaseSubscriptionAnonymous(plan: $plan, receipt: $receipt, deviceId: $deviceId) {
      success
      deviceId
      subscription {
        ...SubscriptionFragment
      }
      message
    }
  }
`;

export const LINK_DEVICE_SUBSCRIPTION_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation LinkDeviceSubscription($deviceId: String!) {
    linkDeviceSubscription(deviceId: $deviceId) {
      success
      message
      user {
        ...UserFragment
      }
    }
  }
`;

export const DEVICE_SUBSCRIPTION_QUERY = gql`
  ${SUBSCRIPTION_FRAGMENT}
  query DeviceSubscription($deviceId: String!) {
    deviceSubscription(deviceId: $deviceId) {
      ...SubscriptionFragment
    }
  }
`;
