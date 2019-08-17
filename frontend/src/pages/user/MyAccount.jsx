import React, {Component, Fragment} from "react";
import {Helmet} from "react-helmet";
import Footer from "../navbarAndFooter/Footer.jsx";
import Navbar from "../navbarAndFooter/Navbar.jsx";
import {Skeleton} from "antd";

import gql from "graphql-tag";
import {Query} from "react-apollo";
import {formatTimeStamp} from "../../components/RelativeTimestamp";

import '../../assets/css/myaccount.min.css';
import {LazyLoadImage} from "react-lazy-load-image-component";
import {getEmoji} from "../../components/Emoji";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({text}) => <div>{text}</div>;


const USERCARD_QUERY = gql`
    query individualUser($jwt_token:String!) {
        individualUser(jwt_token:$jwt_token) {
            _id
            fullname
            image_URL
            email
            signupTimestamp_UNIX
        }
    }
`;

const OrderCard_QUERY = gql`
    query individualOrder($jwt_token:String!) {
        individualOrder(jwt_token:$jwt_token) {
            _id
            received_timestamp_UTC
            processing_start_timestamp_UTC
            processing_end_timestamp_UTC
            shipping_start_timestamp_UTC
            shipping_end_timestamp_UTC
            delivered_timestamp_UTC
            deliveryEstimate_UTC
            status
            subtotal
            shipping_cost
            tax_cost
            order_items{
                title
                price_per_one_item
                main_image_cloudinary_secure_url
                quantity
                currency
            }
        }
    }
`;

const ADDRESS_QUERY = gql`
    query individualOrder($jwt_token:String!) {
        individualOrder(jwt_token:$jwt_token) {
            shippingAddress{
                dateAdded_UTC
                isActive
                shippingName
                addressOne
                addressTwo
                city
                region
                zip
                country
                shippingMethod
                parcelDeliveryLocation{
                    provider
                    name
                    country
                    x_coordinate
                    y_coordinate
                }
            }
        }
    }
`;

export default class MyAccount extends React.Component {
    constructor(props) {
        super(props);
    }

    renderUser(user) {
        return (
            <div className="box">
                <LazyLoadImage
                    alt={user.fullname}
                    src={user.image_URL}
                    width="120px"
                />
                <h3 className="name">{user.fullname}</h3>
                <p className="description">{user.email}</p>
                <p className="description">Joined {formatTimeStamp(user.signupTimestamp_UNIX)}</p>
            </div>
        );
    }


    renderOrder(order) {
        const orderTotal = Math.round(100 * (order.subtotal + order.shipping_cost + order.tax_cost)) / 100;
        const currency = "EUR";

        const renderOrderGoodsTable = function (orderGoods) {
            let resultArray = [];
            for (let i = 0; i < orderGoods.length; i++) {
                const element = orderGoods[i];
                const maxTitleLength = 35;
                const formattedTitle = element.title.length > maxTitleLength ?
                    element.title.substring(0, maxTitleLength - 3) + "..." :
                    element.title;
                resultArray.push(
                    <tr>
                        <td style={{
                            textAlign: "left",
                            fontSize: "11px"
                        }}>{formattedTitle}<br/>Quantity:{element.quantity}<br/>Price:{element.price_per_one_item}{element.currency}
                        </td>
                    </tr>
                );
            }
            return resultArray;
        };
        const renderImages = function (orderGoods) {
            let resultArray = [];
            for (let i = 0; i < orderGoods.length; i++) {
                const element = orderGoods[i];
                resultArray.push(
                    <LazyLoadImage
                        alt={element.title}
                        src={element.main_image_cloudinary_secure_url}
                        width="70px"
                    />
                );
            }
            return resultArray;
        };
        const receiptURL = "receipt/order/" + order._id;
        return (
            <div className="col-sm-6 col-md-5 col-lg-4 item">
                <div className="box">
                    {renderImages(order.order_items)}
                    <p className="description">Order is <b>{order.status.toLowerCase()}</b></p>
                    <p className="description">Order arrives <b>{formatTimeStamp(order.deliveryEstimate_UTC)}</b> <br/>
                    </p>
                    <p className="description">Total:{orderTotal}{currency}</p>
                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                            {renderOrderGoodsTable(order.order_items)}
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <p className="description">Order id: <b>{order._id}</b></p>
                    <br/>
                    <a href={receiptURL}>View the receipt</a>
                </div>
            </div>
        );
    }

    renderAddress(location) {
        const base = location.shippingAddress;
        const shippingName = base.shippingName;
        if (base.shippingMethod === "ParcelDelivery") {
            const locationName = base.parcelDeliveryLocation.name;
            const countryName = base.parcelDeliveryLocation.country;
            const x = base.parcelDeliveryLocation.x_coordinate;
            const y = base.parcelDeliveryLocation.y_coordinate;
            const googleURL = "https://www.google.com/maps/embed/v1/place?key=AIzaSyArway9oG2qWdikdiJcaxxnGqn14SgA6nw&q=" + y + "," + x + "&zoom=16";
            return (
                <div className="col-sm-6 col-md-5 col-lg-4 item">
                    <div className="box">
                        <iframe allowFullScreen="" frameBorder="0"
                                src={googleURL}
                                width="100%" height="400"/>
                        <h3 className="name">{locationName}</h3>
                        <p className="description">Shipped to:{shippingName}</p>
                        <p className="description">{getEmoji(countryName)}</p>
                    </div>
                </div>
            );
        } else {
            const address = base.addressOne + ((base.addressTwo) ? "-" + base.addressTwo : "");
            const zip = base.zip;
            const city = base.city;
            const countryName = base.country;
            const googleURL = "https://www.google.com/maps/embed/v1/place?key=AIzaSyArway9oG2qWdikdiJcaxxnGqn14SgA6nw&q=" + base.addressOne + "+" + zip + "+" + city + "+" + countryName + "&zoom=16";
            return (
                <div className="col-sm-6 col-md-5 col-lg-4 item">
                    <div className="box">
                        <iframe allowFullScreen="" frameBorder="0"
                                src={googleURL}
                                width="100%" height="400"/>
                        <h3 className="name">{address}</h3>
                        <p className="description">Shipped to:{shippingName}</p>
                        <p className="description">{getEmoji(countryName)}</p>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>My account</title>
                    <meta property="og:title" content="My account"/>
                    <meta property="og:description"
                          content="View your personal story at Rocketnow"/>
                    <meta name="description" content="View your personal story at Rocketnow"/>
                </Helmet>
                <Navbar/>
                <div className="features-boxed">
                    <div className="container">
                        <div className="intro"/>
                        <div className="row justify-content-center features">
                            <div className="col-sm-6 col-md-5 col-lg-4 item">
                                <Fragment>
                                    <Query query={USERCARD_QUERY}
                                           variables={{jwt_token: sessionStorage.getItem("jwtToken")}}>
                                        {({data, loading, error}) => {
                                            if (loading) return <Skeleton loading={true} active avatar/>;
                                            if (data) {
                                                return this.renderUser(data.individualUser);
                                            }
                                        }
                                        }
                                    </Query>
                                </Fragment>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="features-boxed">
                    <div className="container">
                        <div className="intro">
                            <h2 className="text-center">Your address</h2>
                        </div>
                        <div className="row justify-content-center features">
                            <Fragment>
                                <Query query={ADDRESS_QUERY}
                                       variables={{jwt_token: sessionStorage.getItem("jwtToken")}}>
                                    {({data, loading, error}) => {
                                        if (loading) return <Skeleton loading={true} active avatar/>;
                                        if (data) {
                                            console.log(data)
                                            return data.individualOrder.map(this.renderAddress)
                                        }
                                        return "";
                                    }
                                    }
                                </Query>
                            </Fragment>
                        </div>
                    </div>
                </div>
                <div className="features-boxed">
                    <div className="container">
                        <div className="intro">
                            <h2 className="text-center">Your Orders</h2>
                        </div>
                        <div className="row padMar">
                            <div className="col padMar">
                                <div className="input-group">
                                    <div className="input-group-prepend"/>
                                    <div className="input-group-append"/>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center features">
                            <Fragment>
                                <Query query={OrderCard_QUERY}
                                       variables={{jwt_token: sessionStorage.getItem("jwtToken")}}>
                                    {({data, loading, error}) => {
                                        if (loading) return <Skeleton loading={true} active avatar/>;
                                        if (data) {
                                            return data.individualOrder.map(this.renderOrder)
                                        }
                                    }
                                    }
                                </Query>
                            </Fragment>
                        </div>
                    </div>
                </div>
                < Footer/>
                < br/> < br/>
            </div>
        );
    }
}