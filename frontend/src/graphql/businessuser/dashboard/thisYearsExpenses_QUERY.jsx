import gql from "graphql-tag";
export const THIS_YEAR_EXPENSES_QUERY = gql`
    query thisYearsExpenses($jwt_token: String!) {
        thisYearsExpenses(jwt_token: $jwt_token)
    }
`;
