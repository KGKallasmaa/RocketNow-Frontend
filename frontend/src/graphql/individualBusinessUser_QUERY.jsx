import gql from "graphql-tag";

export const individualBusinessUser_QUERY = gql`
    query individualBusinessUser($nr:Int!,$businessname:String!) {
        individualBusinessUser(nr:$nr,businessname:$businessname) {
            description
            logoURL
        }
    }
`;