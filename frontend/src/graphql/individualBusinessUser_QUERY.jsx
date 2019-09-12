import gql from "graphql-tag";

export const individualBusinessUser_QUERY = gql`
    query individualBusinessUser($nr:Int!,$displayname:String!) {
        individualBusinessUser(nr:$nr,businessname:$displayname) {
            description
            logoURL
        }
    }
`;