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

  type Query {
    hello: String
    locationsNearby(latitude: Float!, longitude: Float!, radiusKm: Float): [Location!]!
  }
`;
