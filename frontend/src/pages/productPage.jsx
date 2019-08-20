import React, {Fragment} from 'react';
import gql from 'graphql-tag';
import {Helmet} from "react-helmet";
import {message, Select, Skeleton} from "antd";
import {Query} from 'react-apollo';
import '../assets/css/product.min.css';
import {Navbar} from "../components/navbar";
import {Footer} from "../components/footer";
import {AddToCart, AddToFavorites} from "../components/modifyCart";
import {LazyLoadImage} from 'react-lazy-load-image-component';

const {Option} = Select;

const INDIVIDUALGOOD_QUERY = gql`
    query individualGood($nr:Int!,$jwt_token:String) {
        individualGood(nr: $nr,jwt_token:$jwt_token) {
            _id
            nr
            title
            current_price
            general_category {
                name
                tax
            }
            description
            listing_timestamp
            quantity
            booked
            currency
            main_image_cloudinary_secure_url
            seller {
                nr
                businessname
            }
            custom_attribute_names
            custom_attribute_values
        }
    }
`;
const RECCOMEND_GOOD_QUERY = gql`
    query recommend($jwt_token: String,$nr:Int!) {
        recommend(jwt_token: $jwt_token,nr:$nr) {
            _id
            nr
            title
            current_price
            description
            quantity
            booked
            currency
            main_image_cloudinary_secure_url
        }
    }
`;

function renderQuanitity(max_quantity) {
    const children = [];
    for (let i = 1; i < Math.min(11, max_quantity); i++) {
        children.push(<Option key={i}>{i}</Option>);
    }
    return children;
}

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

//TODO
function getDeliveryEstimate() {
    return ("05.09.3029");
}

//TODO
function getShippingEstimate() {
    return ("7€");
}

//TODO
function ReccomendationCart(good) {
    if (!good) {
        return;
    }
    const id = good._id;
    const title = good.title;
    const maxDiscriptionLenght = 80;
    const description = good.description.length > maxDiscriptionLenght ?
        good.description.substring(0, maxDiscriptionLenght - 3) + "..." :
        good.description;

    const main_image = good.main_image_cloudinary_secure_url;
    const max_quantity = Math.max(good.quantity - good.booked, 0);
    const good_url = "/goods/" + good.nr + "/" + good.title;
    return (
        <div className="col-sm-6 col-md-5 col-lg-4 item">
            <div className="box" style={{maxWidth: "100%"}}>
                <a href={good_url}>
                    <LazyLoadImage
                        alt={title}
                        src={main_image}
                        width={"250px"}/>
                </a>
                <h3 className="name">{title}</h3>
                <p className="description">{description}</p>
                <AddToCart title={title} disabled={max_quantity === 0} quantity={1} good_id={id} style={{
                    width: "auto",
                    paddingLeft: "0px",
                    minWidth: "150px",
                    paddingRight: "0px"
                }}/>
            </div>
        </div>
    );
}


function rendeQuanitity(nr) {

    let quanitity = [];

    quanitity.push(
        <option value={1} selected="">1</option>
    );

    for (let i = 1; i < Math.min(10, nr); i++) {
        quanitity.push(
            <option value={i + 1}>{i + 1}</option>
        );
    }
    return quanitity;
}


export default class ProductPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity_selected: 1
        };
        this.new_quantity = this.new_quantity.bind(this);
        this.renderGood = this.renderGood.bind(this);
    }

    renderGood(good) {
        if (!good) return;

        const id = good._id;
        const title = good.title;
        const description = good.description;
        let seller_name = good.seller.businessname;
        let currency = good.currency;
        const tax = good.general_category.tax;
        const price = Math.round(100 * (good.current_price * (1 + tax))) / 100;
        let seller_url = "/seller/" + good.seller.nr + "/" + good.seller.businessname;
        let max_quantity = Math.max(good.quantity - good.booked, 0);
        let main_image = good.main_image_cloudinary_secure_url;
        let custom_attribute_names = good.custom_attribute_names;
        let custom_attribute_values = good.custom_attribute_values;
        let shareDescription = description.length > 80 ? description.substring(0, 80 - 3) + "..." : description;
        let urlToShare = process.env.REACT_APP_PUBLIC_URL + "/goods/" + good.nr + "/" + title;
        let twitterTitle = title + "- Rocketnow";
        let facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" + urlToShare;
        let twitterUrl = "https://twitter.com/share?url=" + urlToShare + "&amp;text=Check%20it%20@%20RocketNow🚀&amp;hashtags=rocketnow";
        let emailUrl = "mailto:?Subject=View " + title + " at RocketNow🚀 &amp;Body=I%20just%20saw%20a%20cool%20product%20at%20RocketNow" + urlToShare;
        let rendered_quantity = rendeQuanitity(max_quantity);

        return (
            <div style={{width: "100%"}}>
                <div className="container" style={{width: "100%", marginTop: "20px"}}>
                    <Helmet>
                        <title>{title}</title>
                        <meta name="twitter:description" content={shareDescription}/>
                        <meta name="twitter:card" content={shareDescription}/>
                        <meta name="twitter:image" content={main_image}/>
                        <meta property="og:image" content={main_image}/>
                        <meta name="description" content={shareDescription}/>
                        <meta property="og:type" content="website"/>
                        <meta name="twitter:title" content={twitterTitle}/>
                        <link rel="canonial" href={urlToShare}/>
                    </Helmet>
                    <div className="row">
                        <div className="col-xl-4"
                             style={{
                                 width: "20%",
                                 maxWidth: "100%",
                                 marginTop: "10px",
                                 maxHeight: "500px",
                                 marginBottom: "20px",
                                 height: "auto",
                                 padding: "10px",
                                 paddingBottom: "10px",
                                 paddingRight: "10px",
                                 minWidth: "310px"
                             }}>
                            <img alt={title} className="w-100 d-block" src={main_image} style={{
                                width: "100%",
                                maxHeight: "500px",
                                height: "auto",
                                maxWidth: "100%"
                            }}/>

                            <h1 style={{width: "20%", minWidth: "300px", fontSize: "35px"}}>
                                <i style={{color: "rgb(6,188,57)"}} className="fa fa-arrow-up"/>100
                                <i style={{color: "rgb(191,11,0)"}} className="fa fa-arrow-down"/>450
                                &nbsp;#123
                            </h1>

                        </div>
                        <div className="col-md-6 col-lg-5 col-xl-4"
                             style={{
                                 marginTop: "20px",
                                 width: "auto",
                                 maxWidth: "100%",
                                 paddingRight: "5px",
                                 paddingLeft: "5px",
                                 minWidth: "150px",
                                 marginBottom: "20px"
                             }}>

                            <h1 style={{fontSize: "32px", color: "#000000"}}>{title}</h1>
                            <span style={{color: "rgb(0,0,0)"}}>Sold by:<a
                                href={seller_url}>{seller_name}</a></span>
                            <p>{description}</p>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <tbody>
                                            {renderCustomAtributes(custom_attribute_names, custom_attribute_values)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3 col-xl-4 visible"
                             style={{
                                 backgroundColor: "rgb(238,244,247)",
                                 marginTop: "20px",
                                 marginBottom: "10px",
                                 maxWidth: "100%",
                                 minWidth: "200px",
                                 height: "280px"
                             }}>
                            <h6 className="text-right"
                                style={{marginTop: "2px", fontSize: "40px", color: " #000000"}}>
                                {price}{currency}
                            </h6>
                            <br/>
                            <form style={{backgroundColor: "#0c81f7"}} onChange={this.new_quantity}>
                                <div style={{backgroundColor: "rgb(238,244,247)"}} className="text-uppercase field">
                                    <select value={this.state.quantity_selected}
                                            style={{backgroundColor: "rgb(255,255,255)"}}
                                            className="custom-select custom-select-lg">
                                        {rendered_quantity}
                                    </select>
                                </div>
                            </form>
                            <div className="btn-group" role="group" style={{width: "95%"}}>
                                <AddToFavorites title={title} disabled={true}
                                                quantity={this.state.quantity_selected}
                                                good_id={id} style={{
                                    width: "auto",
                                    marginLeft: "0px",
                                    paddingLeft: "0px",
                                    minWidth: "56px",
                                    paddingRight: "0px"
                                }}/>
                                <AddToCart title={title} disabled={max_quantity === 0}
                                           quantity={this.state.quantity_selected}
                                           good_id={id} style={{
                                    marginLeft: "23px",
                                    width: "auto",
                                    paddingLeft: "0px",
                                    minWidth: "150px",
                                    paddingRight: "0px"
                                }}/>

                            </div>
                            <br/><br/>
                            <h2
                                className="text-right"
                                style={{
                                    marginTop: "2px",
                                    fontSize: "20px",
                                    color: "#000000",
                                    marginRight: "5px"
                                }}>Estimated
                                arrival time:<b>{getDeliveryEstimate()}</b>
                            </h2>
                            <h2 className="text-right"
                                style={{
                                    marginTop: "2px",
                                    fontSize: "20px",
                                    color: "#000000",
                                    marginRight: "5px"
                                }}>Estimated
                                shipping cost:<b>{getShippingEstimate()}</b>
                            </h2>
                            <div className="col">
                                <ul className="list-inline text-center">
                                    <li className="list-inline-item">
                                        <a href={facebookUrl} target="_blank">
                            <span
                                className="fa-stack fa-lg"><i
                                className="fa fa-circle fa-stack-2x"/><i
                                className="fa fa-facebook fa-stack-1x fa-inverse"/>
                        </span>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href={twitterUrl} target="_blank">
                            <span
                                className="fa-stack fa-lg"><i
                                className="fa fa-circle fa-stack-2x"/><i
                                className="fa fa-twitter fa-stack-1x fa-inverse"/>
                            </span>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href={emailUrl} target="_blank">
                            <span
                                className="fa-stack fa-lg"><i
                                className="fa fa-circle fa-stack-2x"/><i
                                className="fa fa-share-alt fa-stack-1x fa-inverse"/>
                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <br/><br/>
                </div>
            </div>
        );
    }


    new_quantity(event) {
        this.setState({quantity_selected: event.target.value});
    }


    render() {

        const goodVariables = (sessionStorage.getItem("jwtToken") === null) ? {nr: parseInt(this.props.match.params.nr, 10)} : {
            nr: parseInt(this.props.match.params.nr, 10),
            jwt_token: sessionStorage.getItem("jwtToken")
        };

        const reccomendationVariables = (sessionStorage.getItem("jwtToken") === null) ? {nr: 6} : {
            nr: 6,
            jwt_token: sessionStorage.getItem("jwtToken")
        };

        return (
            <div>
                <Navbar/>
                <div/>
                <div style={{width: "100%"}}/>
                <div className="container" style={{width: "100%", marginTop: "20px"}}>
                    <div className="row">
                        <Fragment>
                            <Query query={INDIVIDUALGOOD_QUERY} variables={goodVariables}>
                                {({data, loading, error}) => {
                                    if (loading) return <Skeleton loading={true} active avatar/>;
                                    if (error) console.log(error);
                                    if (data) return this.renderGood(data.individualGood);
                                }
                                }
                            </Query>
                        </Fragment>
                        <br/>
                    </div>
                    <br/><br/>
                </div>
                < div
                    className="features-boxed">
                    < div className="container">
                        < div className="intro">
                            < h2 className="text-center"> You might like </h2>
                        </div>
                        <div className="row justify-content-center features">
                            <Fragment>
                                <Query query={RECCOMEND_GOOD_QUERY} variables={reccomendationVariables}>
                                    {({data, loading, error}) => {
                                        if (loading) return <Skeleton loading={true} active avatar/>;
                                        if (error) console.log(error);
                                        if (data) return data.recommend.map(ReccomendationCart);
                                    }
                                    }
                                </Query>
                            </Fragment>
                        </div>
                    </div>
                </div>
                <br/>
                <Footer/>
            </div>
        );
    }
};