import gql from 'graphql-tag';

export const UserCard_QUERY = gql`
  query individualUser($jwt_token: String!) {
    individualUser(jwt_token: $jwt_token) {
      _id
      fullname
      image_URL
      email
      signupTimestamp_UNIX
    }
  }
`;
