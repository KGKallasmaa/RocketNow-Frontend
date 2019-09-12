import {Navbar} from "../../../components/navbar";
import Footer from "../../../components/footer";
import {Helmet} from "react-helmet";
import React, {Fragment} from "react";
import {Query} from "react-apollo";
import {Skeleton} from "antd";
import {individualBusinessUser_QUERY} from "../../../graphql/individualBusinessUser_QUERY";
import {businessUserGoods_QUERY} from "../../../graphql/businessUserGood_QUERY";

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


export const SellerPage = ({match}) => {
    const displayname = match.params.name;
    const nr = parseInt(match.params.nr, 10);
    const ogTitle = displayname + "at RocketNow";
    const shareDescription = "View what " + displayname + " offers at RocketNow";
    const urlToShare = "/" + nr + "/" + displayname;

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
                    <Fragment>
                        <Query query={individualBusinessUser_QUERY} variables={{nr, displayname}}>
                            {({data, loading}) => {
                                if (loading) return <Skeleton loading={true} active avatar/>;
                                if (data) {
                                    return (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Helmet>
                                                    <meta property="og:image"
                                                          content={data.individualBusinessUser.logoURL}/>
                                                    <meta name="twitter:image"
                                                          content={data.individualBusinessUser.logoURL}/>
                                                </Helmet>
                                                <img className="rounded border"
                                                     src={data.individualBusinessUser.logoURL}
                                                     style={{maxWidth: "100px"}}
                                                     alt={displayname + " logo at RocketNow"}/>
                                            </div>
                                            <div className="col-md-6">
                                                <h1>{displayname}</h1>
                                                <p className="lead">About</p>
                                                <p>{data.individualBusinessUser.description}</p>
                                            </div>
                                        </div>
                                    );
                                }
                            }
                            }
                        </Query>
                    </Fragment>
                </div>
            </div>
            <div style={{backgroundColor: "#f7f7f7"}}>
                <div className="container">
                    <h1>Products</h1>
                    <div className="row flex-box flex-wrap-wrap">
                        <Fragment>
                            <Query query={businessUserGoods_QUERY} variables={{nr,displayname}}>
                                {({data, loading}) => {
                                    if (loading) return <Skeleton loading={true} active avatar/>;
                                    if (data) {
                                        return data.businessUserGoods.map(renderBusinessUserGoods);
                                    }
                                }
                                }
                            </Query>
                        </Fragment>
                    </div>
                </div>
                <br/> <br/> <br/>
            </div>
            <Footer/>
        </div>
    );
};