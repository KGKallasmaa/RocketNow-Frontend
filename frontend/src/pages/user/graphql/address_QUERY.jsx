import gql from "graphql-tag";

export const Address_QUERY = gql`
    query individualOrder($jwt_token:String!) {
        individualOrder(jwt_token:$jwt_token) {
            shippingAddress{
                _id
                dateAdded_UTC
                isActive
                isDefault
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