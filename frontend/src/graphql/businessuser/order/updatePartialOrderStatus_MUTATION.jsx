import gql from "graphql-tag";

export const UPDATE_PARTIAL_ORDER_STATUS = gql`
    mutation updatePartialOrderStatus($jwt_token: String!,$partialOrderId:ID!,$newStatus:String!) {
        updatePartialOrderStatus(jwt_token: $jwt_token,partialOrderId: $partialOrderId,newStatus: $newStatus) {
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
    }
`;