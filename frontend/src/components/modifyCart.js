import React from "react";
import { InputNumber, message} from 'antd';
import {LazyLoadImage} from "react-lazy-load-image-component";
import {currency_symbol_converter} from "./currency_and_symbol";
import {ADD_TOCART_MUTATION} from "../graphql/addToCart_MUTATION";
import {ADD_TO_FAVORITES_MUTATION} from "../graphql/addToFavorites_MUTATION";
import {fetchData} from "../common/fetcher";

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

function getUserId() {
    const jwt_token = sessionStorage.getItem("jwtToken");
    if (jwt_token === null) {
        return sessionStorage.getItem("temporary_user_id");
    }
    return jwt_token;
}

export class AddToCart extends React.PureComponent {
    constructor(props) {
        super(props);
        this.addToCart = this.addToCart.bind(this);
    }

    async addToCart(event) {
        if (event === undefined) {
            return;
        }
        event.preventDefault();
        const variables = {user_identifier: getUserId(), good_id: this.props.good_id, quantity: this.props.quantity};
        let fetchAddGoodsToCart = fetchData(variables, ADD_TOCART_MUTATION);
        let addGoodsToCart = await fetchAddGoodsToCart;
        if (addGoodsToCart !== null) {
            alert_message("SUCCESS", this.props.title, this.props.quantity, "cart");
        }
    }

    render() {
        return (
            <button onClick={this.addToCart} aria-label={"Add to cart"}
                    className="site-btn">Add to cart
            </button>
        );
    }
}

export class RemoveFromCart extends React.Component {
    constructor(props) {
        super(props);
        this.removeFromCart = this.removeFromCart.bind(this);
    }

    async removeFromCart(event) {
        if (event === undefined) {
            return;
        }
        event.preventDefault();
        const variables = {user_identifier: getUserId(), good_id: this.props.good_id, quantity: this.props.quantity};
        let fetchRemoveFromCart = fetchData(variables, ADD_TOCART_MUTATION);
        let removeGoodsFromCart = await fetchRemoveFromCart;
        if (removeGoodsFromCart !== null) {
            alert_message("SUCCESS", this.props.title, this.props.quantity, "cart");
        }
    }

    render() {
        return (
            <button className="btn btn-outline-danger btn-sm" onClick={this.removeFromCart}>
                <i className="fa fa-trash" aria-hidden="true"/>
            </button>
        );
    }
}

export class AddToFavorites extends React.Component {
    constructor(props) {
        super(props);
        this.addToFavorites = this.addToFavorites.bind(this);
    }

    async addToFavorites(event) {
        if (event === undefined) {
            return;
        }
        event.preventDefault();
        const variables = {user_identifier: getUserId(), good_id: this.props.good_id, quantity: this.props.quantity};
        let fetchAddToFavorites = fetchData(variables,ADD_TO_FAVORITES_MUTATION);
        let addGoodsToFavorites = await fetchAddToFavorites;
        if (addGoodsToFavorites !== null) {
            alert_message("SUCCESS", this.props.title, this.props.quantity, "cart");
        }
    }


    render() {
        return (
            <button className="btn btn-outline-danger text-center" style={this.props.style} onClick={this.addToFavorites}>
                <i className="fa fa-heart" aria-hidden="true"/>
            </button>
        );
    }
}


export class EditCartGood extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            good: this.props.good,
            currentQuantity: this.props.good.quantity,
            buttonWasPressed: false
        };
        this.changeQuantity = this.changeQuantity.bind(this);
    }

    async changeQuantity(newQuantity) {
        const {good, currentQuantity} = this.state;
        if (currentQuantity === newQuantity || newQuantity <= 0) {
            return;
        }
        const goodId = good.good._id;
        const title = good.good.title;
        let extraQuantity = 0;

        if (currentQuantity < newQuantity) {
            extraQuantity = newQuantity - currentQuantity;
        } else {
            extraQuantity = currentQuantity - newQuantity;
        }


        const variables = {user_identifier: getUserId(), good_id: goodId, quantity: extraQuantity};
        let fetchModifiedCart = fetchData(variables, ADD_TOCART_MUTATION);


        let ModifiedCart = await fetchModifiedCart;
        if (ModifiedCart  !== null) {
            const base = ModifiedCart.addToCart.goods;
            for (let i = 0; i < base.length; i++) {
                if (base[i].good._id === goodId) {
                    const quantityAtShoppingCart = base[i].quantity;
                    alert_message("SUCCESS", title, quantityAtShoppingCart - currentQuantity, "cart");
                    this.setState({
                        currentQuantity: quantityAtShoppingCart
                    });
                    break;
                }
            }
        }
    }


    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.good !== nextProps.good;
    }

    render() {
        const {good, currentQuantity} = this.state;
        const title = good.good.title;
        const subtotalPrice = good.good.current_price;
        const currency = currency_symbol_converter[good.good.currency];
        const mainImage = good.good.main_image_cloudinary_secure_url;
        return (
            <li>
                <div className="pl-thumb">
                    <LazyLoadImage
                        alt={title}
                        src={mainImage}
                    />
                </div>
                <h6>{title}</h6>
                <p><InputNumber min={1} max={100} defaultValue={currentQuantity}
                                onChange={this.changeQuantity}/> x {currency}{subtotalPrice} <RemoveFromCart
                    good_id={good.good._id} quantity={-currentQuantity} title={title}/></p>
            </li>
        );
    }
}

//TODO: add freature to dynamically add more than 1 items to the cart