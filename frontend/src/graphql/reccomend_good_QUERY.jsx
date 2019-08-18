import gql from "graphql-tag";

export const RECCOMEND_GOOD_QUERY = gql`
    query recommend($jwt_token: String!,$nr:Int!) {
        recommend(jwt_token: $jwt_token,nr:$nr) {
            _id
            nr
            title
            current_price
            description
            quantity
            booked
            currency
            main_image_cloudinary_secure_url
        }
    }
`;