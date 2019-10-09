import React from 'react';
import {message} from "antd";

import "../assets/css/product.min.css"

import Footer from "../components/footer";
import {Navbar} from "../components/navbar";
import axios from 'axios';
import {print} from 'graphql';
import {Helmet} from "react-helmet";
import {product_QUERY} from "../graphql/individualProduct_QUERY";
import {RECOMMEND_GOOD_QUERY} from "../graphql/reccomendGood_QUERY";
import {AddToCart} from "../components/modifyCart";
import {LazyLoadImage} from 'react-lazy-load-image-component';

const currency_display_dictionary = {
    'EUR': '€',
    'USD': '$',
    'RUB': '₽',
    'GBP': '£',
    'CNY': '¥',
    'JPY': '¥',
    'CHF': 'Fr'
};

function renderCustomAtributes(custom_attribute_names, custom_attribute_values) {
    if (custom_attribute_names) {
        let renders = [];
        for (let i = 0; i < custom_attribute_names.length; i++) {
            renders.push(
                <tr>
                    <td>{custom_attribute_names[i]}</td>
                    <td>{custom_attribute_values[i]}</td>
                </tr>)
        }
        return (
            <div className="container-fluid">
                <table className="table">
                    <tbody>
                    {renders}
                    </tbody>
                </table>
            </div>
        );
    }
}

function rendeOtherImages(otherImages, title) {
    if (!otherImages) {
        return;
    }
    let images = [];
    for (let i = 0; i < otherImages.length; i++) {
        const img = otherImages[i];
        images.push(
            <div className="pt active" data-imgbigurl={img}>
                <img src={img} alt={title}/>
            </div>
        );
    }
    return (
        <div className="product-thumbs"  style={{overflow: "hidden", marginBottom:"25px", outline: "none"}}>
            <div className="product-thumbs-track">
                {images}
            </div>
        </div>

    );
}


function reccomendationCard(good) {
    if (!good) {
        return;
    }
    const title = good.title;
    const maxDiscriptionLenght = 80;
    const description = good.description.length > maxDiscriptionLenght ?
        good.description.substring(0, maxDiscriptionLenght - 3) + "..." :
        good.description;

    const main_image = good.main_image_cloudinary_secure_url;
    const good_url = "/goods/" + good.nr + "/" + good.title;
    return (
        <div className="col-sm-6 col-md-5 col-lg-4 item">
            <div className="box" style={{maxWidth: "100%"}}>
                <a href={good_url} aria-label={"View recommended good: "+title}>
                    <LazyLoadImage
                        alt={title}
                        src={main_image}
                        width={"250px"}/>
                </a>
                <br/>
                <h3 className="name">{title}</h3>
                <p className="description">{description}</p>
                <AddToCart title={title} quantity={1} good_id={good._id}/>
            </div>
        </div>
    );
}


export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const goodVariables = (sessionStorage.getItem("jwtToken") === null) ? {nr: parseInt(this.props.match.params.nr, 10)} : {
            nr: parseInt(this.props.match.params.nr, 10),
            jwt_token: sessionStorage.getItem("jwtToken")
        };

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(product_QUERY),
            variables: goodVariables

        }).then(async resData => {
                const base = resData.data.data.individualGood;
                const recVariables = (sessionStorage.getItem("jwtToken") === null) ? {nr: 3} : {
                    nr: 3,
                    jwt_token: sessionStorage.getItem("jwtToken")
                };
                let rec;
                await axios.post(process.env.REACT_APP_SERVER_URL, {
                    query: print(RECOMMEND_GOOD_QUERY),
                    variables: recVariables
                }).then(resData => {
                        rec = resData.data.data.recommend;
                    }
                );
                let price = base.current_price * (1 + base.general_category.tax);
                price = Math.ceil(100 * price) / 100;
                this.setState({
                    id: base._id,
                    title: base.title,
                    description: base.description,
                    currency: currency_display_dictionary[base.currency],
                    price: price,
                    mainImage: base.main_image_cloudinary_secure_url,
                    otherImages: base.other_images_cloudinary_secure_url,
                    category: base.general_category.name,
                    custom_attribute_names: base.custom_attribute_names,
                    custom_attribute_values: base.custom_attribute_values,
                    sellerName: base.seller.displayname,
                    sellerUrl: "/seller/" + base.seller.nr + "/" + base.seller.displayname,
                    rec: rec
                });
            }
        ).catch(error => {
            if (error.response) {
                if (error.response.data) {
                    if (error.response.data.errors[0]) {
                        const errorMessage = error.response.data.errors[0].message;
                        if (errorMessage !== null) {
                            message.error(errorMessage);
                        }
                    }
                }
            }
        });
    }


    render() {
        const {id, title, currency, price, mainImage, description, category, otherImages, custom_attribute_names, custom_attribute_values, sellerName, sellerUrl, rec} = this.state;

        const urlToShare = process.env.REACT_APP_PUBLIC_URL + "/goods/" + this.props.match.params.nr + "/" + title;
        const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" + urlToShare;
        const faceBookUrlText = "Share " + title + " on Facebook";
        const twitterUrl = "https://twitter.com/share?url=" + urlToShare + "&amp;text=Check%20it%20@%20RocketNow🚀&amp;hashtags=rocketnow";
        const twitterUrlText = "Share " + title + " on Twitter";
        const categoryUrl = "/c/" + category;
        const twitterTitle = title + "- Rocketnow";

        return (
            <div>
                <Navbar/>
                <div className="page-top-info">
                    <div className="container">
                        <h4>{title}</h4>
                        <div className="site-pagination">
                            <a title={"Home page"} href="/">Home</a> /
                            <a title={category} href={categoryUrl}>{category}</a>
                        </div>
                    </div>
                </div>
                <Helmet>
                    <title>{title}</title>
                    <meta name="twitter:description" content={description}/>
                    <meta name="twitter:card" content={description}/>
                    <meta name="twitter:image" content={mainImage}/>
                    <meta property="og:image" content={mainImage}/>
                    <meta name="description" content={description}/>
                    <meta property="og:type" content="website"/>
                    <meta name="twitter:title" content={twitterTitle}/>
                    <link rel="canonial" href={urlToShare}/>
                </Helmet>
                <section className="product-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="product-pic-zoom">
                                    <img className="product-big-img" src={mainImage}
                                         alt={title}/>
                                </div>
                                {rendeOtherImages(otherImages, title)}
                            </div>
                            <div className="col-lg-6 product-details">
                                <h2 className="p-title">{title}</h2>
                                <h3 className="p-price">{currency} {price}</h3>
                                <h4 className="p-stock">Sold by: <a href={sellerUrl}><span>{sellerName}</span></a></h4>
                                <div className="quantity">
                                    <p>Quantity</p>
                                    <div className="pro-qty"
                                         aria-label={"Seleclt how many goods you want to add to your cart"}>
                                        <input  aria-label={"Select product quantity"}
                                            type="text" value="1"/>
                                    </div>
                                </div>
                                <AddToCart good_id={id} title={title} quantity={1}/>
                                <div id="accordion" className="accordion-area">
                                    <div className="panel">
                                        <div className="panel-header" id="headingOne">
                                            <button className="panel-link active" data-toggle="collapse"
                                                    data-target="#collapse1" aria-expanded="true"
                                                    aria-controls="collapse1">Description
                                            </button>
                                        </div>
                                        <div id="collapse1" className="collapse show" aria-labelledby="headingOne"
                                             data-parent="#accordion">
                                            <div className="panel-body">
                                                <p> {description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel">
                                        <div className="panel-header" id="headingTwo">
                                            <button className="panel-link" data-toggle="collapse"
                                                    data-target="#collapse2" aria-expanded="false"
                                                    aria-controls="collapse2">Product details
                                            </button>
                                        </div>
                                        <div id="collapse2" className="collapse" aria-labelledby="headingTwo"
                                             data-parent="#accordion">
                                            <div className="panel-body">
                                                <img src="../assets/img/cards.png" alt=""/>
                                                {renderCustomAtributes(custom_attribute_names, custom_attribute_values)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel">
                                        <div className="panel-header" id="headingThree">
                                            <button className="panel-link" data-toggle="collapse"
                                                    data-target="#collapse3" aria-expanded="false"
                                                    aria-controls="collapse3">shipping & Delivery
                                            </button>
                                        </div>
                                        <div id="collapse3" className="collapse" aria-labelledby="headingThree"
                                             data-parent="#accordion">
                                            <div className="panel-body">
                                                <p>Home Delivery
                                                    <br/>
                                                    Estimated delivery time is <span>3 - 4 days</span>
                                                    <br/>
                                                    Home delivery will cost approximately <span>€5</span>
                                                </p>
                                                <p>Parcel Delivery
                                                    <br/>
                                                    Estimated delivery time is <span>1 - 2 days</span>
                                                    <br/>
                                                    Parcel Delivery will cost approximately <span>€3</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="social-sharing">
                                    <a  aria-label={"Share "+title+" on Facebook"} title={faceBookUrlText} href={facebookUrl}><i className="fa fa-facebook"/></a>
                                    <a aria-label={"Share "+title+" on Twitter"} title={twitterUrlText} href={twitterUrl}><i className="fa fa-twitter"/></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                < div className="features-boxed">
                    < div className="container">
                        < div className="intro">
                            < h2 className="text-center"> You might like </h2>
                        </div>
                        <div className="row justify-content-center features">
                            {(rec !== undefined) ? rec.map(reccomendationCard) : <p/>}
                        </div>
                    </div>
                </div>
                <Footer/>
                <script src="../assets/js/jquery-3.2.1.min.js"/>
                <script src="../assets/js/bootstrap.min.js"/>
                <script src="../assets/js/jquery.nicescroll.min.js"/>
                <script src="../assets/js/jquery.zoom.min.js"/>
                <script src="../assets/js/jquery-ui.min.js"/>
                <script src="../assets/js/main.js"/>
            </div>
        );
    }
};