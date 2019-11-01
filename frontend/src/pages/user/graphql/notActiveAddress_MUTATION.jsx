import gql from "graphql-tag";

export const not_Active_Address_MUTATION= gql`
    mutation makeAddressNotActive($jwt_token:String!,$location_id:ID!) {
        makeAddressNotActive(jwt_token:$jwt_token,location_id:$location_id)
    }
`;