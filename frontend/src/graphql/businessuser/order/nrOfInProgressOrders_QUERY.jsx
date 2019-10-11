import gql from "graphql-tag";
export const NR_OF_IN_PROGRESS_ORDERS_QUERY = gql`
    query nrOfInProgressOrders($jwt_token: String!) {
        nrOfInProgressOrders(jwt_token: $jwt_token)
    }
`;
