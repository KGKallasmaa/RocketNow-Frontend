import gql from 'graphql-tag';

export const ADD_TO_FAVORITES_MUTATION = gql`
  mutation addToFavorites($user_identifier: String!, $good_id: ID!, $quantity: Int!) {
    addToFavorites(cart_identifier: $user_identifier, good_id: $good_id, quantity: $quantity) {
      _id
    }
  }
`;
