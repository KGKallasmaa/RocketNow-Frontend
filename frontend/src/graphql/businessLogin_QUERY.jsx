import gql from "graphql-tag";

export const businessLogin_QUERY = gql`
    query businessLogin($email: String!,$password:String!)
    {
        businessLogin(email:$email,password:$password) {
            businessDisplayName
            businessLegalName
            logoURL
            token
            tokenExpiration
        }
    }
`;