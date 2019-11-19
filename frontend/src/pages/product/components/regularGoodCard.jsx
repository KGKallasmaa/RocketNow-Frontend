import React from "react";
import {Helmet} from "react-helmet";
import {AddToCart} from "../../../components/modifyCart.jsx";
import {currency_symbol_converter} from "../../../components/currency_and_symbol";
import {formatTimeStamp} from "../../../components/relativeTimestamp";
import LazyLoad from "react-lazyload";


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


const otherImagesStyle = {overflow: "hidden", marginBottom: "25px", outline: "none"};

function rendeOtherImages(otherImages, title) {
    if (!otherImages) {
        return;
    }
    let images = [];
    for (let i = 0; i < otherImages.length; i++) {
        const img = otherImages[i];
        images.push(
            <div className="pt active" data-imgbigurl={img}>
                <LazyLoad>
                    <img src={img} alt={title}/>
                </LazyLoad>
            </div>
        );
    }
    return (
        <div className="product-thumbs" style={otherImagesStyle}>
            <div className="product-thumbs-track">
                {images}
            </div>
        </div>

    );
}


export default React.memo((props) => {
    const base = props.good;
    const addressDeliveryEstimate = props.addressDeliveryEstimate;
    const parcelDeliveryEstimate = props.parcelDeliveryEstimate;
    let price = base.current_price * (1 + base.general_category.tax);
    price = Math.ceil(100 * price) / 100;
    const id = base._id;
    const currency = currency_symbol_converter[base.currency];
    const sellerUrl = "/seller/" + base.seller.nr + "/" + base.seller.displayname;
    const urlToShare = process.env.REACT_APP_PUBLIC_URL + "/goods/" + props.nr + "/" + base.title;
    const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" + urlToShare;
    const faceBookUrlText = "Share " + base.title + " on Facebook";
    const twitterUrl = "https://twitter.com/share?url=" + urlToShare + "&amp;text=Check%20it%20@%20RocketNow🚀&amp;hashtags=rocketnow";
    const twitterUrlText = "Share " + base.title + " on Twitter";
    const categoryUrl = "/c/" + base.general_category.name;
    const twitterTitle = base.title + "- Rocketnow";

    return (
        <React.Fragment>
            <div className="page-top-info">
                <div className="container">
                    <h4>{base.title}</h4>
                    <div className="site-pagination">
                        <a title={"Home page"} href="/">Home</a> /
                        <a title={base.general_category.name} href={categoryUrl}>{base.general_category.name}</a>
                    </div>
                </div>
            </div>
            <Helmet>
                <title>{base.title}</title>
                <meta name="twitter:description" content={base.description}/>
                <meta name="twitter:card" content={base.description}/>
                <meta name="twitter:image" content={base.main_image_cloudinary_secure_url}/>
                <meta property="og:image" content={base.main_image_cloudinary_secure_url}/>
                <meta name="description" content={base.description}/>
                <meta property="og:type" content="website"/>
                <meta name="twitter:title" content={twitterTitle}/>
                <link rel="canonial" href={urlToShare}/>
            </Helmet>
            <section className="product-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="product-pic-zoom">
                                <img className="product-big-img" src={base.main_image_cloudinary_secure_url}
                                     alt={base.title}/>
                            </div>
                            {rendeOtherImages(base.other_images_cloudinary_secure_url, base.title)}
                        </div>
                        <div className="col-lg-6 product-details">
                            <h2 className="p-title">{base.title}</h2>
                            <h3 className="p-price">{currency} {price}</h3>
                            <h4 className="p-stock">Sold by: <a href={sellerUrl}><span>{base.seller.displayname}</span></a>
                            </h4>
                            <div className="quantity">
                                <p>Quantity</p>
                                <div className="pro-qty"
                                     aria-label={"Seleclt how many goods you want to add to your cart"}>
                                    <input aria-label={"Select product quantity"}
                                           type="text" value="1"/>
                                </div>
                            </div>
                            <AddToCart good_id={id} title={base.title} quantity={1}/>
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
                                            <p> {base.description}</p>
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
                                            {renderCustomAtributes(base.custom_attribute_names, base.custom_attribute_values)}
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
                                                Estimated delivery time is <span>{formatTimeStamp(addressDeliveryEstimate)}</span>
                                                <br/>
                                                Home delivery will cost approximately <span>€5</span>
                                            </p>
                                            <p>Parcel Delivery
                                                <br/>
                                                Estimated delivery time is <span>{formatTimeStamp(parcelDeliveryEstimate)}</span>
                                                <br/>
                                                Parcel Delivery will cost approximately <span>€3</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="social-sharing">
                                <a aria-label={"Share " + base.title + " on Facebook"} title={faceBookUrlText}
                                   href={facebookUrl}><i className="fab fa-facebook"/></a>
                                <a aria-label={"Share " + base.title + " on Twitter"} title={twitterUrlText}
                                   href={twitterUrl}><i className="fab fa-twitter"/></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
});