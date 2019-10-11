import gql from "graphql-tag";

export const PARTIALORDER_QUERY = gql`
    query partialOrdersNotYetShipped($jwt_token: String!) {
        partialOrdersNotYetShipped(jwt_token: $jwt_token) {
            partialOrder{
                _id
                received_timestamp_UTC
                processing_start_timestamp_UTC
                processing_end_timestamp_UTC
                shipped_timestamp_UTC
                partial_subtotal
                partial_shipping_cost
                partial_tax_cost
                partial_order_status
                order_items{
                    title
                    price_per_one_item
                    quantity
                    currency
                }
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
        }
    }
`;