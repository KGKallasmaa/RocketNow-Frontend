import gql from "graphql-tag";

export const DeliveryEstimate_QUERY = gql`
    query DeliveryTimeEstimate(
        $jwt_token: String!,
        $ParcelDeliveryLocation:ID,
        $TimezoneOffset_M:Int!,
        $ShippingName:String,
        $ShippingAddressLine1:String,
        $ShippingAddressLine2:String,
        $ShippingCity:String,
        $ShippingRegion:String,
        $ShippingZip:String,
        $ShippingCountry:String,
        $ShippingMethod:String!,
        $ShippingCost:Float,
        $ShippingCurrency:String!) {
        DeliveryTimeEstimate(deliverytimeEstimateInput:{
            jwt_token:$jwt_token,
            ParcelDeliveryLocation:$ParcelDeliveryLocation,
            TimezoneOffset_M:$TimezoneOffset_M,
            ShippingName:$ShippingName,
            ShippingAddressLine1:$ShippingAddressLine1,
            ShippingAddressLine2:$ShippingAddressLine2,
            ShippingCity:$ShippingCity,
            ShippingRegion:$ShippingRegion,
            ShippingZip:$ShippingZip,
            ShippingCountry:$ShippingCountry,
            ShippingMethod:$ShippingMethod,
            ShippingCost:$ShippingCost,
            ShippingCurrency:$ShippingCurrency
        })
    }
`;