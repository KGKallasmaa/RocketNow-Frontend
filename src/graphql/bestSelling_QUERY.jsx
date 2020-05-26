import gql from 'graphql-tag';

export const BEST_SELLING_QUERY = gql`
  query bestselling($nr: Int!) {
    bestselling(nr: $nr) {
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
