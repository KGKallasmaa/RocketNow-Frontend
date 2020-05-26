import gql from 'graphql-tag';

export const businessUserGoods_QUERY = gql`
  query businessUserGoods($nr: Int!, $displayname: String!) {
    businessUserGoods(nr: $nr, displayname: $displayname) {
      _id
      nr
      title
      main_image_cloudinary_secure_url
    }
  }
`;
