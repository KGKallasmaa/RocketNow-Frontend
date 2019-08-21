import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Footer from "../../components/footer.jsx";
import {Navbar} from "../../components/navbar.jsx";


export default class Business extends React.Component {
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
                    <title>Business</title>
                </Helmet>
                <h1>This page is still under construction</h1>
                <p>Business page</p>
                <Footer/>
            </div>
        );
    }
}
