import React from "react";
import {Icon, message} from 'antd';
import gql from "graphql-tag";
import {Mutation} from "react-apollo";

const ADD_TOCART_MUTAION = gql`
    mutation addToCart($user_identifier:String!,$good_id:ID!,$quantity:Int!) {
        addToCart(cart_identifier:$user_identifier,good_id:$good_id,quantity:$quantity) {
            _id
        }
    }
`;
const alert_message = (type, title, quantity) => {
    const abs_quantity = Math.abs(quantity);
    const isSingular = abs_quantity === 1;

    if (type === "SUCCESS") {
        if (quantity < 0) {
            (isSingular) ? message.success(title + ' was removed from the cart') : message.success(abs_quantity + ' ' + title + 's were removed from the cart');
        } else if (quantity > 0) {
            (isSingular) ? message.success(title + ' was added to the cart') : message.success(abs_quantity + ' ' + title + 's were added to the cart');
        }
    } else if (type === "WARNING") {
        message.warning(title + " couldn't be added to the cart, because you already have the maximum quantity in your shoppingcart")
    } else {
        (isSingular) ? message.error('An error accrued. ' + title + ' was not added to the cart') : message.error('An error accrued. ' + quantity + ' ' + title + 's were not added to the cart');
    }
};
const make_an_id = (size) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
const loadingIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;


function getUserId() {
    //Initial variables
    const jwt_token = sessionStorage.getItem("jwtToken");
    const temporary_user_id = sessionStorage.getItem("temporary_user_id");
    const id_size = 256;

    let user_identifier;
    //1. Is the user logged in?
    if (jwt_token) {
        user_identifier = jwt_token;
    }
    //2 Do we already have a tempoary used id?
    else if (typeof temporary_user_id != 'undefined' && temporary_user_id) {
        user_identifier = temporary_user_id;
    }
    //User is not logged in
    else {
        user_identifier = make_an_id(id_size);
        sessionStorage.setItem("temporary_user_id", user_identifier);
    }
    return user_identifier;

}

export class AddToCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            disabled: this.props.disabled,
            quantity: this.props.quantity,
            good_id: this.props.good_id,
            user_identifier: getUserId(),
        };
    }

    render() {
        const {good_id, quantity, user_identifier, title} = this.state;
        return (
            <div>
                <Mutation
                    mutation={ADD_TOCART_MUTAION}
                    variables={{user_identifier, good_id, quantity}}
                    onCompleted={({data}) => {
                        alert_message("SUCCESS", title, quantity)
                    }
                    }
                >
                    {(addToCart, {loading, error}) => (
                        <div>
                            <button className="btn btn-warning btn-lg" onClick={addToCart}>
                                Add to cart
                            </button>
                            {loading && loadingIcon}
                            {error && alert_message("ERROR", title, quantity)}
                        </div>
                    )}
                </Mutation>
            </div>
        );
    }
}

export class RemoveFromCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            quantity: this.props.quantity,
            good_id: this.props.good_id,
            user_identifier: getUserId(),
        };
    }

    render() {
        const {good_id, quantity, user_identifier, title} = this.state;
        return (
            <div>
                <Mutation
                    mutation={ADD_TOCART_MUTAION}
                    variables={{user_identifier, good_id, quantity}}
                    onCompleted={({data}) => {
                        alert_message("SUCCESS", title, quantity)
                    }
                    }
                >
                    {(addToCart, {loading, error}) => (
                        <div>
                            <button className="btn btn-outline-danger btn-sm" onClick={addToCart}>
                                x
                            </button>
                            {loading && loadingIcon}
                            {error && alert_message("ERROR", title, quantity)}
                        </div>
                    )}
                </Mutation>
            </div>
        );
    }
}

//TODO: add freature to dynamically add more than 1 items to the cart