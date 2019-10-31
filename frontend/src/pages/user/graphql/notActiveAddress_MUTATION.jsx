import gql from "graphql-tag";

export const not_Active_Address_MUTATION= gql`
    mutation makeAddressNotActive($location_id:ID!) {
        makeAddressNotActive(location_id:$location_id)
    }
`;