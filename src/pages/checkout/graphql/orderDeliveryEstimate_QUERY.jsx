import gql from 'graphql-tag';

export const orderDeliveryEstimate_QUERY = gql`
  query DeliveryTimeEstimate(
    $jwt_token: String!
    $timezoneOffset_M: Int!
    $shippingCountry: String!
    $shippingMethod: String!
  ) {
    orderDeliveryEstimate(
      deliveryEstimate: {
        jwt_token: $jwt_token
        timezoneOffset_M: $timezoneOffset_M
        shippingCountry: $shippingCountry
        shippingMethod: $shippingMethod
      }
    ) {
      deliveryTime
    }
  }
`;
