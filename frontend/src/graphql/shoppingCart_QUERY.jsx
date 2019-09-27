import gql from "graphql-tag";

export const SHOPPINGCART_QUERY = gql`
    query individualCart($jwt_token: String!) {
        individualCart(jwt_token: $jwt_token) {
            goods {
                quantity
                good {
                    _id
                    nr
                    title
                    quantity
                    current_price
                    currency
                    main_image_cloudinary_secure_url
                    
                }
            }
        }
    }
`;