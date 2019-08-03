import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'antd/dist/antd.css';

import GoodsPage from "./pages/ProductPage";
import SearchResults from "./pages/SearchResults";
import Reset from "./pages/user/Reset.jsx";
import ShoppingCart from "./pages/checkout/Cart";
import Checkout from "./pages/checkout/Checkout";
import Home from "./pages/Home.jsx";
import BusinessHome from "./pages/business/Home";

import Login from "./pages/user/Login.jsx"
import Signup from "./pages/user/Signup.jsx";
import Vefify from "./pages/user/Verify.jsx";
import MyAccount from "./pages/user/MyAccount";


import SellerPage from "./pages/business/business_public/SellerPage";
import Redirect from "react-router/es/Redirect";
import Success from "./pages/checkout/Success";
import Cancel from "./pages/checkout/Cancel";
import About from "./pages/staic/About";
import Careers from "./pages/staic/Careers";
import Business from "./pages/staic/Business";
import Faq from "./pages/staic/Faq";
import Tos from "./pages/staic/Tos";
import PrivacyPolicy from "./pages/staic/PrivacyPolicy";
import Blog from "./pages/staic/Blog";
import {isBusinessUserLoggedIn, isRegularUserLoggedIn} from "./components/Authentication";


const Logout = (props) =>{
    sessionStorage.clear();
    return (
        <Redirect to=""/>
    )
};


const PrivateBusinessRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isBusinessUserLoggedIn() === true
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
    )} />
);

const PrivateRegularRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isRegularUserLoggedIn() === true
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
    )} />
);


export default class App extends Component {
    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path="/signup"  component={Signup} />
                        <Route exact path="/login"  component={Login}/>
                        <Route exact path="/verify/email/:token?"  component={Vefify}/>
                        <Route exact path="/reset/password/:token?"  component={Reset} />
                        <Route exact path="/logout" component={Logout}/>
                        <Route exact path="/goods/:nr/:title" component={GoodsPage}/>
                        <Route exact path="/cart"  component={ShoppingCart} />
                        <Route exact path="/seller/:nr/:name"  component={SellerPage} />
                        <PrivateRegularRoute path="/checkout" component={Checkout} />
                        <PrivateRegularRoute path="/me" component={MyAccount} />
                        <PrivateRegularRoute path="/success/:success_id" component={Success} />
                        <PrivateRegularRoute path = "/cancel/:cancel_id"component = {Cancel}/>
                        <Route exact path="/search/:query/:page_nr?/:category?"  component={SearchResults} />
                        <PrivateBusinessRoute path= "/business" component={BusinessHome} />
                        <Route exact path="/about"  component={About} />
                        <Route exact path="/careers"  component={Careers} />
                        <Route exact path="/rocketbusiness"  component={Business} />
                        <Route exact path="/faq"  component={Faq} />
                        <Route exact path="/tos"  component={Tos} />
                        <Route exact path="/privacy"  component={PrivacyPolicy} />
                        <Route exact path="/blog"  component={Blog} />
                        <Route exact path = "" component = {Home}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}