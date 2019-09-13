
import gql from "graphql-tag";

export const businessSignUp_MUTATION = gql`
    mutation createBusinessUser($legalname: String!,
        $logoURL: String!
        $displayname: String!,
        $description: String!,
        $email: String!,
        $IBAN: String!,
        $password: String!,
      ) {
        createBusinessUser(userInput:{
            legalname:$legalname,
            logoURL:$logoURL,
            displayname:$displayname,
            description: $description,
            IBAN: $IBAN,
            email: $email,
            password:$password,
           }){
            _id
        }
    }
`;