import gql from "graphql-tag";
export const NR_OF_ORDERDS_PROCESSING_NOT_STARTED_QUERY = gql`
    query nrOfOrdersProcessingNotStarted($jwt_token: String!) {
        nrOfOrdersProcessingNotStarted(jwt_token: $jwt_token)
    }
`;
