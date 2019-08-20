import React, {Fragment} from 'react';
import {Helmet} from 'react-helmet';
import {Footer} from '../../components/footer.jsx';
import {Navbar} from '../../components/navbar.jsx';
import {Skeleton} from 'antd';

import {Query} from 'react-apollo';
import {formatTimeStamp} from '../../components/relativeTimestamp';

import '../../assets/css/myaccount.min.css';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {getEmoji} from '../../components/emoji';
import {UserCard_QUERY} from '../../graphql/userCard_QUERY';
import {OrderCard_QUERY} from '../../graphql/orderCard_QUERY';
import {Address_QUERY} from '../../graphql/address_QUERY';


function renderUser(user) {
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

function renderOrder(order) {
    const orderTotal = Math.round(100 * (order.subtotal + order.shipping_cost + order.tax_cost)) / 100;
    const currency = "EUR";

    const renderOrderGoodsTable = function (orderGoods) {
        let resultArray = [];
        for (let i = 0; i < orderGoods.length; i++) {
            const maxTitleLength = 35;
            const formattedTitle = orderGoods[i].title.length > maxTitleLength ?
                orderGoods[i].title.substring(0, maxTitleLength - 3) + "..." :
                orderGoods[i].title;
            resultArray.push(
                <tr>
                    <td style={{
                        textAlign: "left",
                        fontSize: "11px"
                    }}>{formattedTitle}<br/>Quantity:{orderGoods[i].quantity}<br/>Price:{orderGoods[i].price_per_one_item}{orderGoods[i].currency}
                    </td>
                </tr>
            );
        }
        return resultArray;
    };
    const renderImages = function (orderGoods) {
        let resultArray = [];
        for (let i = 0; i < orderGoods.length; i++) {
            resultArray.push(
                <LazyLoadImage
                    alt={orderGoods[i].title}
                    src={orderGoods[i].main_image_cloudinary_secure_url}
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

function renderAddress(location) {
    const base = location.shippingAddress;
    const shippingName = base.shippingName;
    if (base.shippingMethod === "ParcelDelivery") {
        const googleURL = "https://www.google.com/maps/embed/v1/place?key=AIzaSyArway9oG2qWdikdiJcaxxnGqn14SgA6nw&q=" + base.parcelDeliveryLocation.y_coordinate + "," + base.parcelDeliveryLocation.x_coordinate + "&zoom=16";
        return (
            <div className="col-sm-6 col-md-5 col-lg-4 item">
                <div className="box">
                    <iframe allowFullScreen="" frameBorder="0"
                            src={googleURL}
                            width="100%" height="400"/>
                    <h3 className="name">{base.parcelDeliveryLocation.name}</h3>
                    <p className="description">Shipped to:{shippingName}</p>
                    <p className="description">{getEmoji(base.parcelDeliveryLocation.country)}</p>
                </div>
            </div>
        );
    } else {
        const address = base.addressOne + ((base.addressTwo) ? "-" + base.addressTwo : "");
        const googleURL = "https://www.google.com/maps/embed/v1/place?key=AIzaSyArway9oG2qWdikdiJcaxxnGqn14SgA6nw&q=" + base.addressOne + "+" + base.zip + "+" + base.city + "+" + base.country + "&zoom=16";
        return (
            <div className="col-sm-6 col-md-5 col-lg-4 item">
                <div className="box">
                    <iframe allowFullScreen="" frameBorder="0"
                            src={googleURL}
                            width="100%" height="400"/>
                    <h3 className="name">{address}</h3>
                    <p className="description">Shipped to:{shippingName}</p>
                    <p className="description">{getEmoji(base.country)}</p>
                </div>
            </div>
        );
    }
}

export const MyAccount = () => {
    return (
        <div>
            <Helmet>
                <title>My account</title>
                <meta property="og:title" content="My account"/>
                <meta property="og:description" content="View your personal story at Rocketnow"/>
                <meta name="description" content="View your personal story at RocketNow"/>
            </Helmet>
            <Navbar/>
            <div className="features-boxed">
                <div className="container">
                    <div className="intro"/>
                    <div className="row justify-content-center features">
                        <div className="col-sm-6 col-md-5 col-lg-4 item">
                            <Fragment>
                                <Query query={UserCard_QUERY}
                                       variables={{jwt_token: sessionStorage.getItem("jwtToken")}}>
                                    {({data, loading, error}) => {
                                        if (loading) return <Skeleton loading={true} active avatar/>;
                                        if (data) return renderUser(data.individualUser);
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
                            <Query query={Address_QUERY}
                                   variables={{jwt_token: sessionStorage.getItem("jwtToken")}}>
                                {({data, loading, error}) => {
                                    if (loading) return <Skeleton loading={true} active avatar/>;
                                    if (data) {
                                        return data.individualOrder.map(renderAddress)
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
                                        return data.individualOrder.map(renderOrder)
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
};