import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Footer from "../navbarAndFooter/Footer.jsx";
import Navbar from "../navbarAndFooter/Navbar.jsx";


export default class MyAccount extends React.Component {
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
                    <title>My Account</title>
                </Helmet>
                <h1>This page is still under construction</h1>
                <p>My account page</p>
                <Footer/>
            </div>
        );
    }
}
