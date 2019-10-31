import gql from "graphql-tag";

export const OrderCard_QUERY = gql`
    query individualOrder($jwt_token:String!,$order_id:String) {
        individualOrder(jwt_token:$jwt_token,order_id:$order_id) {
            _id
            customer{
                email
            }
            shippingAddress{
                shippingName
                addressOne
                addressTwo
                city
                region
                zip
                country
                shippingMethod
                parcelDeliveryLocation{
                    provider
                    name
                    country
                }
            }
            received_timestamp_UTC
            subtotal
            shipping_cost
            tax_cost
            status
            order_items{
                title
                price_per_one_item
                quantity
                currency
                main_image_cloudinary_secure_url
            }
        }
    }
`;