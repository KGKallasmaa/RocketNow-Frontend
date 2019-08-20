import gql from "graphql-tag";

export const INDIVIDUALGOOD_QUERY = gql`
    query individualGood($nr:Int!,$jwt_token:String) {
        individualGood(nr: $nr,jwt_token:$jwt_token) {
            _id
            nr
            title
            current_price
            general_category {
                name
                tax
            }
            description
            listing_timestamp
            quantity
            booked
            currency
            main_image_cloudinary_secure_url
            seller {
                nr
                businessname
            }
            custom_attribute_names
            custom_attribute_values
        }
    }
`;