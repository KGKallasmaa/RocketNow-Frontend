import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import GoodsPage from "./pages/productPage";
import SearchResults from "./pages/searchResults";
import Reset from "./pages/user/reset";
import ShoppingCart from "./pages/checkout/cart";
import Home from "./pages/home";
import BusinessHome from "./pages/business/home";

import Login from "./pages/user/login"
import Signup from "./pages/user/signup";
import Verify from "./pages/user/verify";
import {MyAccount} from "./pages/user/myAccount";


import {SellerPage} from "./pages/business/business_public/sellerPage.jsx";
import Redirect from "react-router/es/Redirect";
import Success from "./pages/checkout/success.jsx";
import Cancel from "./pages/checkout/cancel";
import About from "./pages/staic/about";
import Careers from "./pages/staic/careers";
import Business from "./pages/staic/business";
import Faq from "./pages/staic/faq";
import Tos from "./pages/staic/tos";
import PrivacyPolicy from "./pages/staic/privacyPolicy";
import OrderReceipt from "./pages/checkout/orderReceipt";
import Blog from "./pages/staic/blog";
import {isBusinessUserLoggedIn, isRegularUserLoggedIn} from "./components/authentication";

const Logout = () => {
    sessionStorage.clear();
    return (
        <Redirect to=""/>
    );
};

const PrivateBusinessRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        isBusinessUserLoggedIn() === true
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: {from: props.location}
            }}/>
    )}/>
);

const PrivateRegularRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        isRegularUserLoggedIn() === true
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: {from: props.location}
            }}/>
    )}/>
);

export default class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/signup" component={Signup}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/verify/email/:token?" component={Verify}/>
                    <Route exact path="/reset/password/:token?" component={Reset}/>
                    <Route exact path="/logout" component={Logout}/>
                    <Route exact path="/goods/:nr/:title" component={GoodsPage}/>
                    <Route exact path="/cart" component={ShoppingCart}/>
                    <Route exact path="/seller/:nr/:name" component={SellerPage}/>
                    <Route exact path ="/seller/:nr/:name" render={(props) => <SellerPage {...props} />}/>
                    <PrivateRegularRoute path="/me" component={MyAccount}/>
                    <PrivateRegularRoute path="/success/:success_id" component={Success}/>
                    <PrivateRegularRoute path="/cancel/:cancel_id" component={Cancel}/>
                    <PrivateRegularRoute path="/receipt/order/:order_id" component={OrderReceipt}/>
                    <Route exact path="/search/:query/:page_nr?/:category?" component={SearchResults}/>
                    <PrivateBusinessRoute path="/business" component={BusinessHome}/>
                    <Route exact path="/about" component={About}/>
                    <Route exact path="/careers" component={Careers}/>
                    <Route exact path="/rocketbusiness" component={Business}/>
                    <Route exact path="/faq" component={Faq}/>
                    <Route exact path="/tos" component={Tos}/>
                    <Route exact path="/privacy" component={PrivacyPolicy}/>
                    <Route exact path="/blog" component={Blog}/>
                    <Route exact path="" component={Home}/>
                </Switch>
            </Router>
        );
    }
}