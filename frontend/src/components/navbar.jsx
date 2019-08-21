import React, {Component} from 'react';
import SearchBox from "./searchBox.jsx";

import logo from '../assets/img/logo.svg';
import account_not_logged_in_img from '../assets/img/user_not_logged_in.png';
import shopping_cart_img from "../assets/img/shopping_cart_Image.png";
import {isRegularUserLoggedIn} from "./authentication";
import {LazyLoadImage} from "react-lazy-load-image-component";

const PageLogo = () => {
    return (
        <div>
            <a title={"Homepage"} href="/">
                <div style={{
                    paddingRight: "0px",
                    marginRight: "15px",
                    margin_top: "10px"
                }} >
                    <LazyLoadImage
                        alt="RocketNow logo"
                        src={logo}
                        height={"50px"}
                        width={"50px"}/>
                </div>
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

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function renderMyAccountImage(isLoggedIn, image_URL) {
    const img = (isLoggedIn) ? image_URL: account_not_logged_in_img;
    const altMessage = (isLoggedIn) ? "My logged in account": "My Account";
    return (<img style={myAccountImage_style} src={img} alt={altMessage}/>);
}


export const Navbar = () => {
    const image_URL = sessionStorage.getItem("regularUserImageURL");
    const userIsLoggedIn = isRegularUserLoggedIn();
    if (!userIsLoggedIn) {
        const currentTemporaryUserID = sessionStorage.getItem("temporary_user_id");
        if (!currentTemporaryUserID) {
            const temporaryUserID = uuidv4();
            sessionStorage.setItem("temporary_user_id", temporaryUserID.toString());
        }
    }
    const login_or_logout_button_text = (!userIsLoggedIn) ? "Login" : "Logout";
    const login_or_logout_button_url = (!userIsLoggedIn) ? ("/login") : ("/logout");

    return (
        <nav className="navbar navbar-light navbar-expand-md border rounded-0 shadow navigation-clean-search">
            <div className="container">
                <PageLogo/>
                <form className="form-inline mr-auto" target="_self" style={searchForm_style}>
                    <SearchBox style={searchBox_style}/>
                </form>
                <button data-toggle="collapse" className="navbar-toggler" data-target="#navcol-1"><span
                    className="sr-only">Toggle navigation</span><span
                    className="navbar-toggler-icon"/></button>
                <div className="collapse navbar-collapse" id="navcol-1"
                     style={collapsibleNavbar_style}>
                    <ul className="nav navbar-nav">
                        <li className="nav-item" role="presentation">
                            <a title={"My profile page"} href="/me">
                                {renderMyAccountImage(userIsLoggedIn, image_URL)}
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a title={"Shopping cart"} href="/cart">
                                <img
                                    style={shoppingCartImage_style}
                                    src={shopping_cart_img} alt="Shopping Cart"/>
                            </a>
                        </li>
                    </ul>
                    <a className="btn btn-primary action-button" role="button" title={"Logout"}
                       href={login_or_logout_button_url}
                       style={loginButton_style}>{login_or_logout_button_text}</a>
                </div>
                <br/>
            </div>
        </nav>
    );
};