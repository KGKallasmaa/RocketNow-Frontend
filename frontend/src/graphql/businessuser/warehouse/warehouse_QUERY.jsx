import gql from "graphql-tag";

export const WAREHOUSE_QUERY = gql`
    query productsInWarehouse($jwt_token: String!) {
        productsInWarehouse(jwt_token: $jwt_token) {
            _id
            title
            nr
            current_price
            listing_timestamp
            quantity
            booked
            currency
            main_image_cloudinary_secure_url
        }
    }
`;