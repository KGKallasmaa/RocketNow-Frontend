import gql from "graphql-tag";
export const NR_OF_NOT_SHIPPED_ORDERS_QUERY = gql`
    query nrOfNotShippedOrders($jwt_token: String!) {
        nrOfNotShippedOrders(jwt_token: $jwt_token)
    }
`;
