export const typeDefs = `#graphql
  type Location {
    uid: ID!
    title: String!
    address: String!
    latitude: Float!
    longitude: Float!
    description: String
    imageUrl: String
    rating: Float
    reviewCount: Int
  }

  enum SubscriptionPlan {
    MONTHLY
    YEARLY
    LIFETIME
    TRIAL
  }

  enum SubscriptionStatus {
    ACTIVE
    CANCELLED
    EXPIRED
    NONE
  }

  type Subscription {
    plan: SubscriptionPlan!
    status: SubscriptionStatus!
    startDate: String!
    endDate: String
    autoRenew: Boolean!
    transactionId: String!
  }

  type User {
    uid: ID!
    email: String!
    displayName: String
    isCampyPlus: Boolean!
    subscription: Subscription
    deviceId: String
  }

  type AuthPayload {
    token: String!
    user: User!
    linkedSubscription: Boolean
  }

  type PurchaseResult {
    success: Boolean!
    user: User!
    message: String
  }

  type AnonymousPurchaseResult {
    success: Boolean!
    deviceId: String!
    subscription: Subscription
    message: String
  }

  type LinkSubscriptionResult {
    success: Boolean!
    user: User
    message: String
  }

  type Query {
    hello: String
    locationsNearby(latitude: Float!, longitude: Float!, radiusKm: Float): [Location!]!
    me: User
    deviceSubscription(deviceId: String!): Subscription
  }

  type Mutation {
    login(email: String!, password: String!, deviceId: String): AuthPayload!
    purchaseSubscription(plan: SubscriptionPlan!, receipt: String!): PurchaseResult!
    purchaseSubscriptionAnonymous(plan: SubscriptionPlan!, receipt: String!, deviceId: String!): AnonymousPurchaseResult!
    cancelSubscription: PurchaseResult!
    restorePurchases(receipt: String!): PurchaseResult!
    linkDeviceSubscription(deviceId: String!): LinkSubscriptionResult!
  }
`;
