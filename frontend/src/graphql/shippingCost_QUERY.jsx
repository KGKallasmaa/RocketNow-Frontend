import gql from "graphql-tag";

export const ShippingCost_QUERY = gql`
    query DeliveryCost($jwt_token: String!,
        $ParcelDeliveryLocation:ID,
        $TimezoneOffset_M:Int!,
        $ShippingCountry:String,
        $ShippingMethod:String!,
        $ShippingCurrency:String!) {
        DeliveryCost(deliverycostInput:{
            jwt_token:$jwt_token,
            ParcelDeliveryLocation:$ParcelDeliveryLocation,
            TimezoneOffset_M:$TimezoneOffset_M,
            ShippingCountry:$ShippingCountry,
            ShippingMethod:$ShippingMethod,
            ShippingCurrency:$ShippingCurrency
        })
    }
`;