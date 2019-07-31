import React, {Component} from 'react';
import SearchBox from "../../components/SearchBox.jsx";
import ShoppingCart from "../checkout/Cart";

import logo from '../../assets/img/logo.png';
import account_not_logged_in_img from '../../assets/img/user_not_logged_in.png';
import shopping_cart_img from "../../assets/img/Shopping cart Image.png";
import {isRegularUserLoggedIn} from "../../components/Authentication";

const PageLogo = () => {
    return (
        <div>
            <a href="/">
                <img src={logo} style={{
                    width: "50px",
                    height: "50px",
                    paddingRight: "0px",
                    marginRight: "15px",
                    margin_top: "10px"
                }} alt="RocketNow logo"/>
            </a>
        </div>
    )
};

const myAccountImage_style = {
    height: "50px",
    paddingRight: "20px",
    marginTop: "10px"
};
const shoppingCartImage_style = {
    height: "50px",
    paddingRight: "50px",
    paddingLeft: "20px",
    marginTop: "10px"
};

const loginButton_style = {
    backgroundColor: "#1f96fe",
    color: "rgb(242,247,252)",
    height: "auto",
    fontSize: "18px"
};

const collapsibleNavbar_style = {
    paddingLeft: "0px",
    position: "relative",
    maxWidth: "300px",
};

const searchForm_style = {
    margin: "0px",
    paddingTop: "10px",
};


const searchBox_style = {
    height: "50px",
    filter: "contrast(146%)",
    color: "f",
    maxWidth: "550px",
    width: "89%",
    minWidth: "231px"
};

function generate_temporary_userid(size) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.setState({
            visible: false,
        });
        this.showShoppingCart = this.showShoppingCart.bind(this);
        this.shopppingcartElement = React.createRef()
    };

    showShoppingCart = () => {
        if (this.shopppingcartElement.current !== null) {
            this.shopppingcartElement.current.showDrawer();
        }
    };

    renderShoppingCartElement = () => {
        if (sessionStorage.getItem("business_jwtToken") === null) {
            return (<ShoppingCart ref={this.shopppingcartElement}/>);
        }
    };

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

    renderMyAccountImage(isLoggedIn, image_URL) {
        if (isLoggedIn) {
            return (<img
                style={myAccountImage_style}
                src={image_URL} alt="My logged in account"/>);
        }
        return (<img
            style={myAccountImage_style}
            src={account_not_logged_in_img} alt="My Account"/>);
    }


    render() {
        const image_URL = sessionStorage.getItem("regularUserImageURL");
        
        const userIsLoggedIn = isRegularUserLoggedIn();
        let temporary_user_id;
        if (!userIsLoggedIn){
            temporary_user_id = (sessionStorage.getItem("temporary_user_id") !== null) ? sessionStorage.getItem("temporary_user_id") :generate_temporary_userid(256);
        }
        const login_or_logout_button_text = (!userIsLoggedIn) ? "Login" : "Logout";
        const login_or_logout_button_url = (!userIsLoggedIn) ? ("/login") : ("/logout");

        const jwt_token = (userIsLoggedIn) ? sessionStorage.getItem("jwtToken") : temporary_user_id;

        return (
            <nav className="navbar navbar-light navbar-expand-md border rounded-0 shadow navigation-clean-search">
                <div className="container">
                    <PageLogo/>
                    <form className="form-inline mr-auto" target="_self" style={searchForm_style}>
                        <SearchBox query={this.props.query} style={searchBox_style}/>
                    </form>
                    <button data-toggle="collapse" className="navbar-toggler" data-target="#navcol-1"><span
                        className="sr-only">Toggle navigation</span><span
                        className="navbar-toggler-icon"/></button>
                    <div className="collapse navbar-collapse" id="navcol-1"
                         style={collapsibleNavbar_style}>
                        <ul className="nav navbar-nav">
                            <li className="nav-item" role="presentation">
                                <a href="/me">
                                    {this.renderMyAccountImage(userIsLoggedIn, image_URL)}
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a onClick={this.showShoppingCart}>
                                    <img
                                        style={shoppingCartImage_style}
                                        src={shopping_cart_img} alt="Shopping Cart"/>
                                </a>
                            </li>
                        </ul>
                        <a className="btn btn-primary action-button" role="button" href={login_or_logout_button_url}
                           style={loginButton_style}>{login_or_logout_button_text}</a>
                    </div>
                    <br/>
                </div>
                <ShoppingCart token ={jwt_token} ref={this.shopppingcartElement}/>
            </nav>
        );
    }
}