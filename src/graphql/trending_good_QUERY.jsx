import gql from 'graphql-tag';

export const TRENDING_GOOD_QUERY = gql`
  query trending {
    trending {
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
      currency
      main_image_cloudinary_secure_url
    }
  }
`;
