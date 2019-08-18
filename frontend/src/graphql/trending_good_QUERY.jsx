import gql from "graphql-tag";

export const TRENDING_GOOD_QUERY = gql`
    query trending($country: String!) {
        trending(country: $country) {
            _id
            nr
            title
            current_price
            description
            quantity
            currency
            main_image_cloudinary_secure_url
        }
    }
`;