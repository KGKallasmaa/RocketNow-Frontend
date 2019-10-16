import gql from "graphql-tag";

export const ADD_TOCART_MUTATION = gql`
    mutation addToCart($user_identifier:String!,$good_id:ID!,$quantity:Int!) {
        addToCart(cart_identifier:$user_identifier,good_id:$good_id,quantity:$quantity) {
            goods{
                quantity
                good{
                    _id
                }
            }
        }
    }
`;