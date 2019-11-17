import React from "react";
import {Redirect} from "react-router-dom";

import {Navbar} from "../../components/navbar";
import Footer from "../../components/footer";

import {individualBusinessUser_QUERY} from "./graphql/individualBusinessUser_QUERY";
import {businessUserGoods_QUERY} from "./graphql/businessUserGood_QUERY";
import {fetchData} from "../../components/fetcher";

import {Helmet} from "react-helmet";
import {Button, Empty, Skeleton} from "antd";
import 'antd/es/button/style/css';
import 'antd/es/empty/style/css';
import 'antd/es/skeleton/style/css';

import notLoadedLogo from "./assets/img/seller-logo-not-loaded.jpg";
import noOrders from "../user/assets/img/noOrders.webp";
import LazyLoad from "react-lazyload";



function renderBusinessUserGoods(good) {
    const url = "/goods/" + good.nr + "/" + good.title;
    return (
        <div className="col-sm-4 flex-box flex-justify-center flex-align-center">
            <a className="fancybox"
               rel="gallery1"
               title={good.title}
               href={url}>
                <img alt={good.title} className="img-fluid" src={good.main_image_cloudinary_secure_url}/>
            </a>
            <br/> <br/>
        </div>
    );
}

function renderGoods(goods) {
    if (goods) {
        return goods.map(renderBusinessUserGoods);
    }
    return "";
}

function renderRedirect(redirect) {
    console.log("kaya")
    if (redirect === true) {
        const redirectUrl = "/noseller";
        return <Redirect to={redirectUrl}/>
    }
};

function renderNoGoods(goods, name) {
    if (!goods) {
        return (
            <React.Fragment>
                <br/>
                <Empty
                    image={noOrders}
                    imageStyle={{
                        height: 250,
                    }}
                    description={
                        <span>{name} hasn't listed any goods yet.</span>
                    }
                >
                    <Button href={"/"} type="primary">Go to homepage</Button>
                </Empty>
                <br/> <br/><br/> <br/><br/> <br/> <br/>
            </React.Fragment>
        );
    }
}

export default class SellerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentDidMount: false,
            redirect: false
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextState.redirect === true) {
            return true;
        }
        return nextState.goods !== undefined;
    }

    async componentDidMount() {
        const sellerInfoVariables = {
            nr: parseInt(this.props.match.params.nr, 10),
            displayname: this.props.match.params.name
        };
        let fetchSellerInfo = fetchData(sellerInfoVariables, individualBusinessUser_QUERY);
        let fetchSellerGoods = fetchData(sellerInfoVariables, businessUserGoods_QUERY);
        let sellerData = await fetchSellerInfo;
        if (sellerData !== null) {
            this.setState({
                logoURL: sellerData.individualBusinessUser.logoURL,
                description: sellerData.individualBusinessUser.description,
            });
        }

        if (sellerData === null) {
            this.setState({
                redirect: true
            });
        } else {
            let sellerGoods = await fetchSellerGoods;
            if (sellerGoods !== null) {
                this.setState({
                    goods: sellerGoods.businessUserGoods,
                    componentDidMount: true
                });
            }
        }
    }


    render() {
        const nr = parseInt(this.props.match.params.nr, 10);
        const ogTitle = this.props.match.params.name + "at RocketNow";
        const shareDescription = "View what " + this.props.match.params.name + " offers at RocketNow";
        const urlToShare = "/" + nr + "/" + this.props.match.params.name;
        const {logoURL, description, goods, componentDidMount, redirect} = this.state;


        if (!componentDidMount) {
            return (
                <React.Fragment>
                    <Navbar/>
                    <br/><br/><br/>
                    <div style={{backgroundColor: "#f7f7f7"}}>
                        {renderRedirect(redirect)}
                        <br/>
                        <br/>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <LazyLoad>
                                        <img className="rounded border"
                                             src={notLoadedLogo}
                                             style={{maxWidth: "100px"}}
                                             alt={this.props.match.params.name + " logo at RocketNow"}/>
                                    </LazyLoad>
                                </div>
                                <div className="col-md-6">
                                    <h1>{this.props.match.params.name}</h1>
                                    <p className="lead">About</p>
                                    <Skeleton rows={1} loading={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{backgroundColor: "#f7f7f7"}}>
                        <div className="container">
                            <h1>Products</h1>
                            <br/>
                            <div className="row flex-box flex-wrap-wrap">
                                <Skeleton rows={3} loading={true} active avatar/>
                                <hr/>
                                <Skeleton rows={3} loading={true} active avatar/>
                                <hr/>
                                <Skeleton rows={3} loading={true} active avatar/>
                                <hr/>
                            </div>
                        </div>
                        <br/>
                        <br/><br/>
                        <Footer/>
                    </div>
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                <Helmet>
                    <title>{this.props.match.params.name} at RocketNow</title>
                    <meta property="og:title" content={ogTitle}/>
                    <meta property="twitter:title" content={ogTitle}/>
                    <meta property="og:type" content="website"/>
                    <meta name="description" content={shareDescription}/>
                    <meta name="twitter:card" content="summary_large_image"/>
                    <link rel="canonial" href={urlToShare}/>
                </Helmet>
                <Navbar/>
                <br/>
                <br/><br/><br/>
                <div style={{backgroundColor: "#f7f7f7"}}>
                    <br/>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <Helmet>
                                    <meta property="og:image"
                                          content={logoURL}/>
                                    <meta name="twitter:image"
                                          content={logoURL}/>
                                </Helmet>
                                <img className="rounded border"
                                     src={logoURL}
                                     style={{maxWidth: "100px"}}
                                     alt={this.props.match.params.name + " logo at RocketNow"}/>

                            </div>
                            <div className="col-md-6">
                                <h1>{this.props.match.params.name}</h1>
                                <p className="lead">About</p>
                                <p>{description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{backgroundColor: "#f7f7f7"}}>
                    <div className="container">
                        <br/>
                        <h1>Products</h1>
                        <div className="row flex-box flex-wrap-wrap">
                            {renderGoods(goods)}
                        </div>
                        {renderNoGoods(goods, this.props.match.params.name)}
                    </div>
                    <br/> <br/> <br/>
                    <br/><br/><br/>
                    <Footer/>
                </div>
            </React.Fragment>
        );
    }
};