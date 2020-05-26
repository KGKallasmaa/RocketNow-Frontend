import gql from 'graphql-tag';

export const ShippingLocations_QUERY = gql`
  query($UserLatCoordinate: Float!, $UserLonCoordinate: Float!) {
    ParcelDeliveryLocations(UserLatCoordinate: $UserLatCoordinate, UserLonCoordinate: $UserLonCoordinate) {
      _id
      name
      provider
      country
    }
  }
`;
