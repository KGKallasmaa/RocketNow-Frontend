import gql from "graphql-tag";

export const OrderCard_QUERY = gql`
    query individualOrder($jwt_token:String!) {
        individualOrder(jwt_token:$jwt_token) {
            _id
            received_timestamp_UTC
            processing_start_timestamp_UTC
            processing_end_timestamp_UTC
            shipped_timestamp_UTC
            deliveryEstimate_UTC
            status
            subtotal
            shipping_cost
            tax_cost
            order_items{
                title
                price_per_one_item
                main_image_cloudinary_secure_url
                quantity
                currency
            }
        }
    }
`;