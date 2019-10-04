import {Navbar} from "../../../components/navbar";
import Footer from "../../../components/footer";
import {Helmet} from "react-helmet";
import React, {Fragment} from "react";
import {Query} from "react-apollo";
import {message, Skeleton} from "antd";
import {individualBusinessUser_QUERY} from "../../../graphql/individualBusinessUser_QUERY";
import {businessUserGoods_QUERY} from "../../../graphql/businessUserGood_QUERY";
import axios from "axios";
import {print} from "graphql";
import {product_QUERY} from "../../../graphql/individualProduct_QUERY";
import {RECOMMEND_GOOD_QUERY} from "../../../graphql/reccomendGood_QUERY";

function renderBusinessUserGoods(good) {
    const url = "/goods" + good.nr + "/" + good.title;
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
    return ""
}


export default class SellerPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const variables =
            {
                nr: parseInt(this.props.match.params.nr,10),
                displayname: this.props.match.params.name
            };
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(individualBusinessUser_QUERY),
            variables: variables

        }).then(resData => {
                const base = resData.data.data.individualBusinessUser;
                this.setState({
                    logoURL: base.logoURL,
                    description: base.description
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
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(businessUserGoods_QUERY),
            variables: variables

        }).then(resData => {
                this.setState({
                    goods: resData.data.data.businessUserGoods
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
        const displayname = this.props.match.params.name;
        const nr = parseInt(this.props.match.params.nr, 10);
        const ogTitle = displayname + "at RocketNow";
        const shareDescription = "View what " + displayname + " offers at RocketNow";
        const urlToShare = "/" + nr + "/" + displayname;
        const {logoURL, description, goods} = this.state;
        return (
            <div>
                <Helmet>
                    <title>{displayname} at RocketNow</title>
                    <meta property="og:title" content={ogTitle}/>
                    <meta property="twitter:title" content={ogTitle}/>
                    <meta property="og:type" content="website"/>
                    <meta name="description" content={shareDescription}/>
                    <meta name="twitter:card" content="summary_large_image"/>
                    <link rel="canonial" href={urlToShare}/>
                </Helmet>
                <Navbar/>
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
                                     alt={displayname + " logo at RocketNow"}/>
                            </div>
                            <div className="col-md-6">
                                <h1>{displayname}</h1>
                                <p className="lead">About</p>
                                <p>{description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{backgroundColor: "#f7f7f7"}}>
                    <div className="container">
                        <h1>Products</h1>
                        <div className="row flex-box flex-wrap-wrap">
                            {renderGoods(goods)}
                        </div>
                    </div>
                    <br/> <br/> <br/>
                </div>
                <Footer/>
            </div>
        );
    }
};