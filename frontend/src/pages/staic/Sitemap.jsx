import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Footer from "../navbarAndFooter/Footer.jsx";
import Navbar from "../navbarAndFooter/Navbar.jsx";


export default class Sitemap extends React.Component {
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
                    <title>Sitemap</title>
                </Helmet>
                <h1>This page is still under construction</h1>
                <p>Sitemap</p>
                <Footer/>
            </div>
        );
    }
}
