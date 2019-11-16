import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Footer from "../../components/footer.jsx";
import {Navbar} from "../../components/navbar.jsx";
import AcceptsCookies from "../../components/legal/cookieConsent";


export default class Cancel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cancel_id: this.props.cancel_id,
        };
    }

    render() {
        return (
            <div className="container-fluid">
                <Navbar/>
                <Helmet>
                    <title>Your order was canceled on RocketNow</title>
                </Helmet>
                <AcceptsCookies/>
                <h1>This page is still under construction</h1>
                <p>Cancel page</p>
                <Footer/>
            </div>
        );
    }
}
