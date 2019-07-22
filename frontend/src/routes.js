import React from "react";
import {Route, Switch} from "react-router-dom";

import GoodsPage from "./pages/IndividualGoodPage";
import SearchResults from "./pages/SearchResults";
import Reset from "./pages/user/Reset";
import ShoppingCart from "./pages/checkout/Cart";
import Checkout from "./pages/checkout/Checkout";
import Home from "./pages/Home.jsx";
import BusinessHome from "./pages/business/Home";

import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import SellerPage from "./pages/business/business_public/SellerPage";
import Redirect from "react-router/es/Redirect";
import Success from "./pages/checkout/Success";
import Cancel from "./pages/checkout/Cancel";
import Sitemap from "./pages/staic/Sitemap";
import About from "./pages/staic/About";
import Careers from "./pages/staic/Careers";
import Business from "./pages/staic/Business";
import Faq from "./pages/staic/Faq";
import Tos from "./pages/staic/Tos";
import Blog from "./pages/staic/Blog";


const Logout = (props) =>{
    sessionStorage.clear();
    return (
    <Redirect to=""/>
    )
};

//TODO: fix authentication
const business_is_auth = (sessionStorage.getItem("business_jwtToken") !== null) && (Number(sessionStorage.getItem("jwtToken_expires")) > new Date().getTime());
const regular_is_auth =  ((sessionStorage.getItem("jwtToken") !== null) && (Number(sessionStorage.getItem("jwtToken_expires")) > new Date().getTime()));




const PrivateBusinessRoute = ({ component: Component, ...rest }) => (    
    <Route {...rest} render={(props) => (
      business_is_auth === true
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
    )} />
  );

const PrivateRegularRoute = ({ component: Component, ...rest }) => (    
    <Route {...rest} render={(props) => (
      regular_is_auth === true
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
    )} />
  );


const BaseRouter = (props) => (
    <div>
        <React.Fragment>
            <Switch>
                <Route exact path="/sitemap"  component={Sitemap} />
                <Route exact path="/signup"  component={Signup} />
                <Route exact path="/login"  component={Login}/>
                <Route exact path="/logout" component={Logout}/>
                <Route exact path="/goods/:good_id" component={GoodsPage}/>
                <Route exact path="/cart"  component={ShoppingCart} />
                <Route exact path="/seller/:name"  component={SellerPage} />
                <Route exact path="/reset"  component={Reset} />
                <PrivateRegularRoute path="/checkout" component={Checkout} />
                <PrivateRegularRoute path="/success/:success_id" component={Success} />
                < PrivateRegularRoute path = "/cancel/:cancel_id"component = {Cancel}/>
                <Route exact path="/search/:query/:page_nr?/:category?"  component={SearchResults} />
                <PrivateBusinessRoute path= "/business" component={BusinessHome} />
                <Route exact path="/about"  component={About} />
                <Route exact path="/careers"  component={Careers} />
                <Route exact path="/rocketbusiness"  component={Business} />
                <Route exact path="/faq"  component={Faq} />
                <Route exact path="/toc"  component={Tos} />
                <Route exact path="/blog"  component={Blog} />
                <Route exact path = "" component = {Home}/>
            </Switch>
        </React.Fragment>
    </div>
);

export default BaseRouter;