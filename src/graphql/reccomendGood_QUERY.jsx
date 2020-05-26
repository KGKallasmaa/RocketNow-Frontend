import gql from 'graphql-tag';

export const RECOMMEND_GOOD_QUERY = gql`
  query recommend($jwt_token: String, $nr: Int!) {
    recommend(jwt_token: $jwt_token, nr: $nr) {
      _id
      nr
      title
      current_price
      general_category {
        name
        tax
      }
      description
      quantity
      booked
      currency
      main_image_cloudinary_secure_url
    }
  }
`;
