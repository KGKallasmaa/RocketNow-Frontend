import gql from "graphql-tag";

export const REFINEMENT_QUERY = gql`
    query refine($query: String!) {
        refine(query:$query) {
            total
            minPrice
            maxPrice
            categories
            numbericRefinements
            nonNumbericRefinements
        }
    }
`;