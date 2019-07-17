import React, {Fragment} from "react";
import {Drawer, Empty, Skeleton} from 'antd';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Image} from 'cloudinary-react';
import Redirect from "react-router-dom/es/Redirect";
import {RemoveFromCart} from '../buttons/ModifyCart';


const NUMBEROFGOODS_INCART_AND_SUBTOTAL_QUERY = gql`
    query numberOfGoodsInCartAndSubtotal($jwt_token: String!) {
        numberOfGoodsInCartAndSubtotal(jwt_token: $jwt_token)
    }
`;
const SHOPPINGCART_QUERY = gql`
    query individualCart($jwt_token: String!) {
        individualCart(jwt_token: $jwt_token) {
            goods {
                price_per_one_item
                quantity
                good {
                    _id
                    title
                    quantity
                    current_price
                    currency
                    main_image_cloudinary_public_id
                }
            }
        }
    }
`;

const currency_display_dictionary = {
    "EUR": "€",
    "USD": "$",
    "RUB": "₽",
    "GBP": "£",
    "CNY": "¥",
    "JPY": "¥",
    "CHF": "Fr"
};

function generate_temporary_userid(size) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function renderResults(good, jwt_token) {
    //TODO: remove const variables  #performance
    const title = good.good.title;
    const main_image = good.good.main_image_cloudinary_public_id;

    const currency = currency_display_dictionary[good.good.currency];
    const price = good.price_per_one_item;

    const quantity = good.quantity;
    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-3">
                                <Image secure="true" cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
                                       publicId={main_image} width="60" crop="scale"/>
                            </div>
                            <div className="col-md-7">
                                <h3>{title}</h3>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h5>{quantity}<span>x</span>&nbsp;<b>{price}</b>{currency}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <RemoveFromCart
                                    title={title}
                                    quantity={-quantity}
                                    good_id={good.good._id}
                                    cart_identifier={jwt_token}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    );
}

function show_EmptyState(nr_of_items, text) {
    if (nr_of_items === 0) return (<Empty description={text}/>);
}


export default class ShoppingCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            cart_goods: [],
            loading: true,
            redirect: false
        };
    }

    showDrawer = () => {
        this.setState({
            visible: true
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    goToCheckout = () => {
        this.setState({
            redirect: true
        });
    };
    renderRedirect = () => {
        if (this.state.redirect === true) {
            const redirect_url = '/checkout';
            return <Redirect to={redirect_url}/>
        }
    };

    getShoppingCart = (jwt_token) => {
        return (
            <Fragment>
                < Query query={SHOPPINGCART_QUERY} variables={{jwt_token}}>
                    {({data, loading, error}) => {
                        if (loading) return <Skeleton loading={true} active avatar/>;
                        if (error) console.log(error);
                        if (data) {
                            if (data.individualCart.goods.length === 0) {
                                return "";
                            } else {
                                let rendered_good_array = [];
                                for (let index = 0; index < data.individualCart.goods.length; index++) {
                                    const good = data.individualCart.goods[index];
                                    rendered_good_array.push(renderResults(good, jwt_token));
                                }
                                return rendered_good_array;
                            }
                        }
                    }
                    }
                </Query>
            </Fragment>
        );
    };
    getNrOfItemsAndCartSubtotal = (jwt_token) => {
        return (
            <Fragment>
                <Query query={NUMBEROFGOODS_INCART_AND_SUBTOTAL_QUERY} variables={{jwt_token}}>
                    {({data, loading, error}) => {
                        if (loading) return <Skeleton loading={true}/>;
                        if (error) console.log(error);
                        if (data) {
                            const nr_of_goods = data.numberOfGoodsInCartAndSubtotal[0];
                            const subtotal = data.numberOfGoodsInCartAndSubtotal[1];
                            if (nr_of_goods === 0) {
                                return show_EmptyState(nr_of_goods, "Your shoppingcart is empty")
                            } else {
                                return (
                                    <div>
                                        <h3>Subtotal({nr_of_goods}):<b>{subtotal}</b>€
                                        </h3>
                                        <button
                                            className="align-self-end btn btn-lg btn-block btn-warning"
                                            disabled={nr_of_goods === 0}
                                            onClick={this.goToCheckout}>
                                            Go to Checkout
                                        </button>
                                    </div>
                                );
                            }
                        }
                    }
                    }
                </Query>
            </Fragment>
        );
    }


    render() {
        const jwt = sessionStorage.getItem("jwtToken");
        const temporary_user_id = (sessionStorage.getItem("temporary_user_id") !== null) ? sessionStorage.getItem("temporary_user_id") : generate_temporary_userid(256);
        if (sessionStorage.getItem("temporary_user_id")) sessionStorage.setItem("temporary_user_id", temporary_user_id);

        const jwt_token = (jwt !== null) ? jwt : temporary_user_id;
        console.log(jwt_token);
        return (
            <div>
                <Drawer title={"Shopping cart"} placement="right" closable={false} width={520} onClose={this.onClose}
                        visible={this.state.visible}>
                    <div className="card-body">
                        {this.getShoppingCart(jwt_token)}
                    </div>
                    {this.getNrOfItemsAndCartSubtotal(jwt_token)}
                    <br/>
                    {this.renderRedirect()}
                </Drawer>
            </div>
        );
    }
}