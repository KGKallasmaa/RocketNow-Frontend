import gql from "graphql-tag";

export const singleProductDeliveryEstimate_QUERY = gql`
    query singleProductDeliveryEstimate($good_id:ID!,$quantity:Int!,$TimezoneOffset_M:Int!,$lat:Float!,$long:Float!) {
        singleProductDeliveryEstimate(deliveryEstimate:{
            good_id:$good_id,
            quantity:$quantity,
            timezoneOffset_M:$TimezoneOffset_M,
            lat:$lat,
            long:$long
        }){
           deliveryTime 
        }
    }
`;