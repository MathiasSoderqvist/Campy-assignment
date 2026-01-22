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

  type User {
    uid: ID!
    email: String!
    displayName: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    hello: String
    locationsNearby(latitude: Float!, longitude: Float!, radiusKm: Float): [Location!]!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
  }
`;
