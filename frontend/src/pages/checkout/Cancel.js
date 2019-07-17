import React, {Component} from "react";
import {Helmet} from "react-helmet";
import PageFooter from "../navbar_and_footer/PageFooter";
import PageNavbar from "../navbar_and_footer/PageNavbar";


export default class Cancel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cancel_id: this.props.cancel_id,
        };
    }  
             render (){
                   return (
            <div className="container-fluid">
                <PageNavbar/>
                <Helmet>
                    <title>Your order was canceled on RocketNow</title>
                </Helmet>
                <p>Cancel page</p>
                <PageFooter/>
            </div> 
                   );
             }
     
   
    }
