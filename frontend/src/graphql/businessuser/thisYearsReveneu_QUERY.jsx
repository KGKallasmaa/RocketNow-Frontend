import gql from "graphql-tag";

export const THIS_YEAR_REVENEU_QUERY = gql`
    query thisYearsRevenue($jwt_token: String!) {
        thisYearsRevenue(jwt_token: $jwt_token)
    }
`;