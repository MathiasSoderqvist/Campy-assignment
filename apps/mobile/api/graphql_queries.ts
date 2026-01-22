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

export const FETCH_LOCATIONS_NEARBY = gql`
  ${LOCATION_FRAGMENT}
  query LocationsNearby($latitude: Float!, $longitude: Float!, $radiusKm: Float) {
    locations: locationsNearby(latitude: $latitude, longitude: $longitude, radiusKm: $radiusKm) {
      ...LocationFragment
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        uid
        email
        displayName
      }
    }
  }
`;
