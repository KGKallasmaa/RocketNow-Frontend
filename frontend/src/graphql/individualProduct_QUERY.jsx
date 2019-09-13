import gql from "graphql-tag";

export const product_QUERY = gql`
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
            other_images_cloudinary_secure_url
            seller {
                nr
                displayname
            }
            custom_attribute_names
            custom_attribute_values
        }
    }
`;