import React, {Fragment} from 'react';
import {Skeleton} from 'antd';
import Navbar from './navbarAndFooter/Navbar.jsx';
import Footer from './navbarAndFooter/Footer.jsx';
import {Query} from 'react-apollo';

import book_img from "../assets/img/Book_Category_Image.png";
import tickets_img from "../assets/img/Tickets_category_Image.png";
import electronics_img from "../assets/img/Electronics_Category_Image.png";

import jewelry_img from "../assets/img/Jewelry_Category__Image.png";
import pets_img from "../assets/img/Pets_Category_Image.png";
import sports_img from "../assets/img/Sports_Category_image.png";
import gql from "graphql-tag";

import "../assets/css/home.min.css";
import {AddToCart} from "../buttons/ModifyCart";
import Card from "antd/es/card";

//todo: example pictures. Remove later


const axios = require("axios");

const {Meta} = Card;


const TRENDING_GOOD_QUERY = gql`
    query trending($country: String!) {
        trending(country: $country) {
            _id
            nr
            title
            current_price
            description
            quantity
            currency
            main_image_cloudinary_secure_url
        }
    }
`;
const RECCOMEND_GOOD_QUERY = gql`
    query recommend($jwt_token: String!,$nr:Int!) {
        recommend(jwt_token: $jwt_token,nr:$nr) {
            _id
            nr
            title
            current_price
            description
            quantity
            currency
            main_image_cloudinary_secure_url
        }
    }
`;


const GoodCard = (props) => {
    const good_url = "/goods/" + props.nr+"/"+props.title;
    const image_style = {
        height: "auto",
        maxWidth: "350px"
    };
    const button_style = {
        width: "350px",
        maxWidth: "100%",
        minWidth: "100%"
    };
    const maxDiscriptionLenght = 150;
    const description = props.description.length > maxDiscriptionLenght ?
        props.description.substring(0, maxDiscriptionLenght - 3) + "..." :
        props.description;
    return (
        <div className="col-md-4 cust_blogteaser">
            <a href={good_url}>

                <Card
                    hoverable
                    cover={<img className="img-fluid"
                                alt={props.title}
                                style={image_style}
                                src={props.main_image_cloudinary_secure_url}/>}
                >
                    <Meta title={props.title} description={description}/>
                </Card>
            </a>
            <AddToCart style={button_style} title={props.title} quantity={1} good_id={props._id}/>
        </div>
    )
};
const TopCategories = (props) => {
    const image_style = {
        height: "150px",
        width: "50%",
        maxWidth: "150px"
    };


    return (
        <div className="row justify-content-center features">
            <div className="col-sm-6 col-md-5 col-lg-4 item">
                <img className="img-fluid"
                     style={image_style}
                     src={book_img}
                     alt="Books"/>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
                <img className="img-fluid"
                     style={image_style}
                     src={tickets_img}
                     alt="Tickets"/>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
                <img className="img-fluid"
                     style={image_style}
                     src={electronics_img}
                     alt="Electronics"/>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
                <img className="img-fluid"
                     style={image_style}
                     src={pets_img}
                     alt="Pets"/>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
                <img className="img-fluid"
                     style={image_style}
                     src={jewelry_img}
                     alt="Jewelry"/>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
                <img className="img-fluid"
                     style={image_style}
                     src={sports_img}
                     alt="Sports"/>
            </div>
        </div>
    )
};


function generate_temporary_userid(size) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect_to_business: false
        };
        if (sessionStorage.getItem('business_jwtToken')) {
            this.setState({
                redirect_to_business: true
            });
        }
    }

    getCountryEmoji(Country) {
        switch (Country) {
            case "Estonia":
                return "🇪🇪";
            default:
                return "";
        }
    }



    render() {
        const card_Columns_style = {
            marginTop: "52px",
            marginLeft: "34px",
            fontFamily: "Open Sans sans-serif",
            fontSize: "30px",
            fontWeight: "800",
            lineHeight: " 32px",
            color: "rgb(0,0,0)"
        };
        const country = 'Estonia';

        const regular_token = sessionStorage.getItem("jwtToken");

        const temporary_user_id = (sessionStorage.getItem("temporary_user_id") !== null) ? sessionStorage.getItem("temporary_user_id") : generate_temporary_userid(256);
        if (sessionStorage.getItem("temporary_user_id")) sessionStorage.setItem("temporary_user_id", temporary_user_id);

        const jwt_token = (regular_token !== null) ? regular_token : temporary_user_id;

        const nr = 3;

        return (
            <div>
                <Navbar/>
                <br/>
                <div>
                    <div className="container">
                        <h1 className="display-2 text-justify"
                            style={card_Columns_style}>
                            <strong>Trending in&nbsp;{this.getCountryEmoji(country)}</strong></h1>
                        <br/>
                        <div className="row">
                            <Fragment>
                                <Query query={TRENDING_GOOD_QUERY} variables={{country}}>
                                    {({data, loading, error}) => {
                                        if (loading) return <Skeleton loading={true}/>;
                                        if (error) console.log(error);
                                        if (data) {
                                            if (data.trending.length === 0) {
                                                return ""
                                            }
                                            return data.trending.map(GoodCard)
                                        }
                                    }
                                    }
                                </Query>
                            </Fragment>
                        </div>
                    </div>
                </div>
                <br/>
                <div>
                    <div className="container">
                        <h2 className="text-justify"
                            style={card_Columns_style}>
                            <strong>Our picks for you</strong></h2>
                        <br/>
                        <div className="row">
                            <Fragment>
                                <Query query={RECCOMEND_GOOD_QUERY} variables={{jwt_token,nr}}>
                                    {({data, loading, error}) => {
                                        if (loading) return <Skeleton loading={true}/>;
                                        if (error) console.log(error);
                                        if (data) {
                                            if (data.recommend.length === 0) {
                                                return ""
                                            }
                                            return data.recommend.map(GoodCard)
                                        }
                                    }
                                    }
                                </Query>
                            </Fragment>
                        </div>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </div>
                <br/>
                <br/>
                <div className="features-boxed">
                    <div className="container">
                        <div className="intro">
                            <h1 className="text-center" style={{fontSize: "45px"}}>Top categories</h1>
                        </div>
                        <TopCategories/>
                    </div>
                </div>
                <Footer/>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"/>
                <script
                    src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.bundle.min.js"/>
            </div>
        );
    }
};