import React from "react";
import {Navbar} from "../../../components/navbar";
import Footer from "../../../components/footer";
import {Helmet} from "react-helmet";
import "../assets/css/notLoggedInHome.min.css";
import "../assets/css/bootstrap.min.css";

import algolia from "../assets/img/algolia.jpeg";
import choice from "../assets/img/choice.jpeg";
import delivery from "../assets/img/delivery.jpeg";
import digitalGoods from "../assets/img/digital_goods.jpeg";
import electronics from "../assets/img/electronics.jpeg";
import entertainment from "../assets/img/entartainment.jpeg";
import messenger from "../assets/img/facebook-messenger.svg";
import fashion from "../assets/img/fashion.jpeg";
import healthAndBeauty from "../assets/img/health_and_beauty.jpeg";
import mailChimp from "../assets/img/mail_chimp.jpeg";
import shippo from "../assets/img/shippo.jpeg";
import stripe from "../assets/img/stripe.jpeg";
import subscription from "../assets/img/subscribtions.jpeg";
import support from "../assets/img/support.jpeg";
import CustomerChat from "../../../components/customerChat/customerChat";
import AcceptsCookies from "../../../components/legal/cookie_consent";

const font = {fontFamily: "Lato"};

export default React.memo(() => {
        return (
            <React.Fragment>
                <Helmet>
                    <link rel="canonial" href="http://rocketnow.eu"/>
                </Helmet>
                <Navbar/>
                <header className="masthead text-center text-white">
                    <div className="masthead-content">
                        <div className="container text-left">
                            <h1 className="text-left masthead-heading mb-0"
                                style={font}>RocketNow
                            </h1>
                            <h2 className="text-left masthead-subheading mb-0" style={font}>
                                Shop for everything
                            </h2>
                            <a className="btn btn-primary visible btn-xl rounded-pill mt-5" role="button"
                               href="/about" id="learnMore" aria-label={"Read the story of RocketNow"}>
                                Learn More
                            </a>
                        </div>
                    </div>
                    <div/>
                    <div className="bg-circle-1 bg-circle"/>
                    <div className="bg-circle-2 bg-circle"/>
                    <div className="bg-circle-3 bg-circle"/>
                </header>
                <AcceptsCookies/>
                <div className="brands">
                    <a href="/about" aria-label={"Read the story of RocketNow"}>
                        <img className="img-fluid visible" src={stripe}
                             alt="stripe logo" loading="lazy"/>
                        <img className="visible"
                             src={shippo}
                             alt="shippo logo"
                             loading="lazy"/>
                        <img
                            className="visible" src={algolia} alt="algolia logo" loading="lazy"/>
                        <img
                            className="visible" src={mailChimp} loading="lazy" alt="mailchimp logo"/>
                        <img
                            className="visible" src={messenger} style={{width: "140px", height: "40px"}}
                            alt="messenger logo" loading="lazy"/>
                    </a>
                </div>
                <div/>
                <div/>
                <section>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 order-lg-2">
                                <div className="p-5">
                                    <img className="rounded-circle img-fluid" src={choice}
                                         alt="choice balloons"/>
                                </div>
                            </div>
                            <div className="col-lg-6 order-lg-1">
                                <div className="p-5">
                                    <h2 className="display-4" style={{fontSize: "36px", fontFamily: "Lato"}}>
                                        For great choice appreciators<br/><br/>
                                    </h2>
                                    <p className="sellingpointText">While most platforms limit their selection to one or two
                                        categories, we offer goods in 6 categories. <br/>Looking for a book to entertain? We
                                        got you covered!<br/> Looking for a nice notebook for your friend's birthday?
                                        Would you like a black, a yellow or a green one?
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="article-list" id="grey">
                    <div className="container">
                        <div className="intro"/>
                        <div className="row articles">
                            <div className="col-lg-3">
                                <h2 className="text-center">Shop by category</h2>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-3 item"
                                 style={{paddingBottom: "30px", paddingTop: "40px"}}>
                                <h3 className="name" style={{fontSize: "20px", fontFamily: "Lato"}}>
                                    Fashion
                                </h3>
                                <a href="/c/fashion" aria-label={"View our fashion selection"}>
                                    <img className="img-fluid" src={fashion}
                                         alt="fashion category"/>
                                </a>
                                <h3 className="name"
                                    style={{fontSize: "20px", fontFamily: "Lato"}}>
                                    Health &amp; Beauty
                                </h3>

                                <a href="/c/health_and_beauty" aria-label={"View our health & beauty selection"}>
                                    <img className="img-fluid" src={healthAndBeauty}
                                         alt="health and beauty category"/>
                                </a>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-3 item"
                                 style={{paddingBottom: "30px", paddingTop: "40px"}}>
                                <h3 className="name"
                                    style={{fontSize: "20px", fontFamily: "Lato"}}>
                                    Subscriptions
                                </h3>
                                <a href="/c/subscriptions" aria-label={"View our subscriptions selection"}>
                                    <img className="img-fluid" src={subscription}
                                         alt="subscriptions category"/>
                                </a>
                                <h3 className="name" style={{fontSize: "20px", fontFamily: "Lato"}}>
                                    Digital Goods
                                </h3>

                                <a href="/c/digital" aria-label={"View our digital goods selection"}>
                                    <img className="img-fluid" src={digitalGoods}
                                         alt="digital goods category"/>
                                </a>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-3 item"
                                 style={{paddingBottom: "30px", paddingTop: "40px"}}>
                                <h3 className="name"
                                    style={{fontSize: "20px", fontFamily: "Lato"}}>Entertainment
                                </h3>

                                <a href="/c/entertainment" aria-label={"View our entertainment selection"}>
                                    <img className="img-fluid" src={entertainment}
                                         alt="entertainment category"/>
                                </a>
                                <h3 className="name" style={{fontSize: "20px", fontFamily: "Lato"}}>
                                    Electronics
                                </h3>
                                <a href="/c/electronics" aria-label={"View our electronics selection"}>
                                    <img className="img-fluid" src={electronics}
                                         alt="electronics category"/>
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
                <section>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 order-lg-1">
                                <div className="p-5">
                                    <img className="rounded-circle img-fluid"
                                         src={delivery}
                                         alt="accurate delivery"/>
                                </div>
                            </div>
                            <div className="col-lg-6 order-lg-2">
                                <div className="p-5">
                                    <h2 className="display-4" style={{fontSize: "36px", fontFamily: "Lato"}}>
                                        For accurate delivery lovers
                                    </h2>
                                    <br/>
                                    <p className="sellingpointText">Our cutting edge technology
                                        and close relationships with the merchants help us accurately predict when your
                                        orders arrive. This gives you peace of mind and frees up your time.<br/> Spend it
                                        with
                                        your loved ones.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="features-boxed" id="grey">
                    <div className="container" id="grey">
                        <div className="intro">
                            <h2 className="text-center" style={font}>How to use RocketNow</h2>
                        </div>
                        <div className="row justify-content-center features">
                            <div className="col-sm-6 col-md-5 col-lg-4 item">
                                <div className="box"><i className="fa fa-pencil icon" id="howToIcon"/>
                                    <h3 className="name" style={font}>1. Signup for free.</h3>
                                    <p className="description">Sign up &nbsp;online for free. &nbsp;All you need is an email
                                        address, or a Google or Facebook account.&nbsp;</p>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-5 col-lg-4 item">
                                <div className="box"><i className="fa fa-search icon" id="howToIcon"/>
                                    <h3 className="name" style={font}>2. Search for Products</h3>
                                    <p className="description">Tell us what are you looking for. Search for a specific title
                                        or
                                        a general term. You can also browse through our categories.</p>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-5 col-lg-4 item">
                                <div className="box"><i className="fa fa-truck icon" id="howToIcon"/>
                                    <h3 className="name" style={font}>3. Choose a Shipping
                                        Option</h3>
                                    <p className="description">We can ship your order to a parcel location or your home
                                        address.
                                        We're also providing you with an estimated arrival time.</p>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-5 col-lg-4 item">
                                <div className="box"><i className="fa fa-cc-stripe icon" id="howToIcon"/>
                                    <h3 className="name" style={font}>4. Enter Payment
                                        Details</h3>
                                    <p className="description">We accept all major credit and debit cards. Your payment is
                                        securely processed by Stripe. </p>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-5 col-lg-4 item">
                                <div className="box"><i className="fa fa-barcode icon" id="howToIcon"/>
                                    <h3 className="name" style={font}>5. Track your Order</h3>
                                    <p className="description">You can track your order in your account, and we'll tell when
                                        it's shipped. We're also giving you the estimated arrival time.</p>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-5 col-lg-4 item">
                                <div className="box"><i className="fa fa-heart-o icon" id="howToIcon"/>
                                    <h3 className="name" style={font}>
                                        6. &nbsp;Spread the Love
                                    </h3>
                                    <p className="description">That's it. Pick up your order from your shipping
                                        location. &nbsp;Enjoy it and &nbsp;spread the love.&nbsp;</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 order-lg-2">
                                <div className="p-5">
                                    <img className="rounded-circle img-fluid" src={support}
                                         alt="RocketNow support"/>
                                </div>
                            </div>
                            <div className="col-lg-6 order-lg-1">
                                <div className="p-5">
                                    <h2 className="display-4" style={{fontSize: "36px", fontFamily: "Lato"}}>
                                        Support all the way!</h2>
                                    <br/>
                                    <p className="sellingpointText">We're there for you at every
                                        step of the way. <br/>If you need help with your orders or you have an awesome idea
                                        on how to make the service better for everyone there's always a lovely person
                                        whom
                                        you can chat with.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="highlight-clean" id="grey">
                    <div className="container" id="grey">
                        <div className="intro">
                            <h2 className="text-center" style={{fontSize: "30px", fontFamily: "Lato"}}>Numerous
                                goods
                                are waiting for you<br/><br/><a className="btn btn-primary btn-block btn-lg" role="button"
                                                                aria-label={"Sign up with RocketNow"}
                                                                href="/signup">Sign up for free</a></h2>
                        </div>
                    </div>
                </div>
                <CustomerChat/>
                <Footer/>
            </React.Fragment>
        );
    }
);