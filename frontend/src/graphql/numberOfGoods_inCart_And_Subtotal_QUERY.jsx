import gql from "graphql-tag";

export const NUMBEROFGOODS_INCART_AND_SUBTOTAL_QUERY = gql`
    query numberOfGoodsInCartAndSubtotalAndTax($jwt_token: String!) {
        numberOfGoodsInCartAndSubtotalAndTax(jwt_token: $jwt_token)
    }
`;