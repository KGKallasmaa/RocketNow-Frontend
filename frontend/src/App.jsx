import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch,Redirect} from 'react-router-dom';

import GoodsPage from "./pages/product/productPage";
import CategoryPage from "./pages/categoryPage";
import SearchResults from "./pages/searchResults";
//import Reset from "./pages/user/reset";
import ShoppingCart from "./pages/checkout/cart";
import Home from "./pages/homepage/home";


import Login from "./pages/user/login"
import Signup from "./pages/user/signup";
import Verify from "./pages/user/verify";
import MyAccount from "./pages/user/myAccount";

import PageNotFound from "./pages/pageNotFound.jsx";


import SellerPage from "./pages/sellerspage/sellerPage.jsx";
import Success from "./pages/checkout/success.jsx";
import Cancel from "./pages/checkout/cancel";
import About from "./pages/staic/about";
import Careers from "./pages/staic/careers";
import Faq from "./pages/staic/faq";
import Tos from "./pages/staic/tos";
import Contact from "./pages/staic/contact";
import PrivacyPolicy from "./pages/staic/privacyPolicy";
import OrderReceipt from "./pages/checkout/orderReceipt";
import Blog from "./pages/staic/blog";
import {isRegularUserLoggedIn} from "./components/authentication";


const Logout = () => {
    sessionStorage.clear();
    return (
        <Redirect to=""/>
    );
};



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

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/signup" component={Signup}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/verify/email/:token?" component={Verify}/>
                <Route exact path="/logout" component={Logout}/>
                <Route exact path="/goods/:nr/:title" component={GoodsPage}/>
                <Route exact path="/c/:category" component={CategoryPage}/>
                <Route exact path="/cart" component={ShoppingCart}/>
                <Route exact path="/seller/:nr/:name" render={(props) => <SellerPage {...props} />}/>
                <PrivateRegularRoute path="/me" component={MyAccount}/>
                <PrivateRegularRoute path="/success/:success_id" component={Success}/>
                <PrivateRegularRoute path="/cancel/:cancel_id" component={Cancel}/>
                <PrivateRegularRoute path="/receipt/order/:order_id" component={OrderReceipt}/>
                <Route exact path="/search/:query" component={SearchResults}/>
                <Route exact path="/about" component={About}/>
                <Route exact path="/careers" component={Careers}/>
                <Route exact path="/faq" component={Faq}/>
                <Route exact path="/tos" component={Tos}/>
                <Route exact path="/privacy" component={PrivacyPolicy}/>
                <Route exact path="/blog" component={Blog}/>
                <Route exact path="/contact" component={Contact}/>
                <Route exact path="/" component={Home}/>
                <Route path="*" component={PageNotFound} />
            </Switch>
        </Router>
    );
};
//TODO: implement pw reset                 <Route exact path="/reset/password/:token?" component={Reset}/>