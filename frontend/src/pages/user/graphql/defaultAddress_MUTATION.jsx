import gql from "graphql-tag";

export const default_Address_MUTATION= gql`
    mutation makeAddressDefault($jwt_token:String!,$location_id:ID!) {
        makeAddressDefault(jwt_token:$jwt_token,location_id:$location_id)
    }
`;