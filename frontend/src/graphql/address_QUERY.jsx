import gql from "graphql-tag";

export const Address_QUERY = gql`
    query individualOrder($jwt_token:String!) {
        individualOrder(jwt_token:$jwt_token) {
            shippingAddress{
                dateAdded_UTC
                isActive
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
                    x_coordinate
                    y_coordinate
                }
            }
        }
    }
`;