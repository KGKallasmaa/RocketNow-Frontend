import gql from "graphql-tag";

export const THIS_MONTH_REVENEU_QUERY = gql`
    query thisMonthsRevenue($jwt_token: String!) {
        thisMonthsRevenue(jwt_token: $jwt_token)
    }
`;