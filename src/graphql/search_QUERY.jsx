import gql from 'graphql-tag';

export const SEARCH_QUERY = gql`
  query Search($query: String!) {
    search(query: $query) {
      numericRefinements
      nonNumericRefinements
    }
  }
`;
