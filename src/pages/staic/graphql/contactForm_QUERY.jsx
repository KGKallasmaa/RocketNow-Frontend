import gql from 'graphql-tag';

export const contactForm_QUERY = gql`
  query receiveContactFormMessage(
    $clientName: String!
    $clientEmail: String!
    $subject: String!
    $clientMessage: String!
  ) {
    receiveContactFormMessage(
      clientName: $clientName
      clientEmail: $clientEmail
      subject: $subject
      clientMessage: $clientMessage
    )
  }
`;
