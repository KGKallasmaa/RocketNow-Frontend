import React from "react";
import {Icon, message} from 'antd';
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import axios from 'axios';
import {print} from "graphql";

const ADD_TOCART_MUTAION = gql`
    mutation addToCart($user_identifier:String!,$good_id:ID!,$quantity:Int!) {
        addToCart(cart_identifier:$user_identifier,good_id:$good_id,quantity:$quantity) {
            _id
        }
    }
`;
const ADD_TO_FAVORITES_MUTAION = gql`
    mutation addToFavorites($user_identifier:String!,$good_id:ID!,$quantity:Int!) {
        addToFavorites(cart_identifier:$user_identifier,good_id:$good_id,quantity:$quantity) {
            _id
        }
    }
`;
const alert_message = (type, title, quantity, cathegory) => {
    const abs_quantity = Math.abs(quantity);
    const isSingular = abs_quantity === 1;

    if (type === "SUCCESS") {
        if (quantity < 0) {
            (isSingular) ? message.success(title + ' was removed from the ' + cathegory) : message.success(abs_quantity + ' ' + title + 's were removed from the ' + cathegory);
        } else if (quantity > 0) {
            (isSingular) ? message.success(title + ' was added to the ' + cathegory) : message.success(abs_quantity + ' ' + title + 's were added to the ' + cathegory);
        }
    } else if (type === "WARNING") {
        message.warning(title + " couldn't be added to the " + cathegory + ", because you already have selected the maximu quantity")
    } else {
        (isSingular) ? message.error('An error accrued. ' + title + ' was not added to the ' + cathegory) : message.error('An error accrued. ' + quantity + ' ' + title + 's were not added to the ' + cathegory);
    }
};

const loadingIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;


function getUserId() {
    const jwt_token = sessionStorage.getItem("jwtToken");
    if (jwt_token === null) {
        return sessionStorage.getItem("temporary_user_id");
    }
    return jwt_token;

}

export class AddToCart extends React.Component {
    constructor(props) {
        super(props);
        this.addToCart = this.addToCart.bind(this);
    }

    addToCart(event) {
        if (event === undefined){
            return;
        }
        event.preventDefault();
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(ADD_TOCART_MUTAION),
            variables: {user_identifier: getUserId(), good_id: this.props.good_id, quantity: this.props.quantity}

        }).then(() => {
                alert_message("SUCCESS",this.props.title, this.props.quantity, "cart")
            }
        ).catch(error => {
            if (error.response) {
                if (error.response.data) {
                    if (error.response.data.errors[0]) {
                        const errorMessage = error.response.data.errors[0].message;
                        if (errorMessage !== null) {
                            message.error(errorMessage);
                        }
                    }
                }
            }
        });
    }

    render() {
        return (
            <button onClick={this.addToCart} aria-label={"Add to cart"}
                    className="site-btn">Add to cart
            </button>
        );
    }
}


export class AddToFavorites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            disabled: this.props.disabled,
            quantity: this.props.quantity,
            good_id: this.props.good_id,
            style: this.props.style,
            user_identifier: getUserId(),
        };
    }

    render() {
        const {good_id, style, quantity, user_identifier, title, disabled} = this.state;
        return (
            <div>
                <Mutation
                    mutation={ADD_TO_FAVORITES_MUTAION}
                    variables={{user_identifier, good_id, quantity}}
                    onCompleted={({data}) => {
                        alert_message("SUCCESS", title, quantity, "favorites")
                    }
                    }
                >
                    {(addToFavorites, {loading, error}) => (
                        <div>
                            <button disabled={disabled} style={style} className="btn btn-outline-danger text-center"
                                    aria-label={"Add to favorites"}
                                    type="button" onClick={addToFavorites}>
                                {<i className="fa fa-heart"/>}
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
                        alert_message("SUCCESS", title, quantity, "cart")
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