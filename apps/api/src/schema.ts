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
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type PurchaseResult {
    success: Boolean!
    user: User!
    message: String
  }

  type Query {
    hello: String
    locationsNearby(latitude: Float!, longitude: Float!, radiusKm: Float): [Location!]!
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    purchaseSubscription(plan: SubscriptionPlan!, receipt: String!): PurchaseResult!
    cancelSubscription: PurchaseResult!
    restorePurchases(receipt: String!): PurchaseResult!
  }
`;
