import gql from "graphql-tag";
export const UN_COMPLETED_ORDERS_VALUE_QUERY = gql`
    query unCompletedOrdersValue($jwt_token: String!) {
        unCompletedOrdersValue(jwt_token: $jwt_token)
    }
`;
