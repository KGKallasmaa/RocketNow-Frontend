import gql from "graphql-tag";
export const THIS_MONTH_EXPENSES_QUERY = gql`
    query thisMonthsExpenses($jwt_token: String!) {
        thisMonthsExpenses(jwt_token: $jwt_token)
    }
`;
