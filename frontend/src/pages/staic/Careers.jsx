import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Footer from "../navbarAndFooter/Footer.jsx";
import Navbar from "../navbarAndFooter/Navbar.jsx";


export default class Careers extends React.Component {
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
                    <title>Careers</title>
                </Helmet>
                <h1>This page is still under construction</h1>
                <h3>If your are interested to contribute,my email is karl.gustav1789@gmail.com</h3>
                <Footer/>
            </div>
        );
    }
}
