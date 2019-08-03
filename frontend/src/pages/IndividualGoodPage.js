import React, {Fragment} from "react";
import Navbar from "./navbarAndFooter/Navbar.jsx";
import Footer from "./navbarAndFooter/Footer.jsx";
import {Breadcrumb, Carousel, Icon, InputNumber, Rate, Skeleton, Tabs} from "antd";
import {AddToCart} from '../buttons/ModifyCart';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Image} from 'cloudinary-react';
import {Helmet} from "react-helmet";

const TabPane = Tabs.TabPane;

const INDIVIDUALGOOD_QUERY = gql`
    query individualGood($good_id: ID!,$jwt_token:String) {
        individualGood(id: $good_id,jwt_token:$jwt_token) {
            _id
            title
            current_price
            description
            listing_timestamp
            quantity
            currency
            main_image_cloudinary_secure_url
            other_images_cloudinary_secure_url
            seller {
                businessname
            }
            custom_attribute_names
            custom_attribute_values
        }
    }
`;

//TODO: develop -> back button
export default class GoodsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity_selected: 1,
        };
        this.new_quantity = this.new_quantity.bind(this);
    }

    new_quantity(value) {
        this.setState({
            quantity_selected: value
        });
    }

    renderGood(good) {
        //Goods components
        const title = good.title;
        const description = good.description;
        const seller_name = good.seller.businessname;
        const currency = good.currency;
        const price = good.current_price;
        const seller_url = "/seller/" + seller_name;

        const rating = 3.5;//todo: make it dynamic
        const max_quantity = good.quantity;

        //Render listing dates
        const currentDate = new Date(Number(good.listing_timestamp));
        const date = currentDate.getDate();
        let month = currentDate.getMonth(); //Be careful! January is 0 not 1
        const year = currentDate.getFullYear();
        const listing_date = date + "." + (month + 1) + "." + year;

        //Render images
        let images = [];
        const main_image = good.main_image_cloudinary_secure_url;
        const other_images = good.other_images_cloudinary_secure_url;
        images.push(<div><img alt={title} src={main_image} style={{ width:"300x"}}/></div>);
        for (let index = 0; index < other_images.length; index++) {
            const element = other_images[index];
            images.push(<div><img alt={title} src={element} style={{ width:"300x"}}/></div>);
        }
        //Render custom attributes and values
        const custom_attribute_names = good.custom_attribute_names;
        const custom_attribute_values = good.custom_attribute_values;
        let extra_information = [];
        for (let i = 0; i < custom_attribute_names.length; i++) {
            extra_information.push(
                <tr>
                    <th scope="row">{custom_attribute_names[i]}:</th>
                    <td>{custom_attribute_values[i]}</td>
                </tr>
            );
        }

        //SEO
        const cannonial_url = process.env.REACT_APP_CLIENT_URL + "/goods/" + good._id;
        const share_image = good.main_image_cloudinary_secure_url;
        return (
            <div className="container-fluid">
                <Helmet>
                    <title>NoNoLine: {title}</title>
                    <link rel="canonial" href={cannonial_url}/>
                    <meta property="og:url"                content={cannonial_url} />
                    <meta property="og:type"               content="product" />
                    <meta property="og:title"              content={title} />
                    <meta property="og:description"        content={description} />
                    <meta property="og:image"              content={share_image} />
                    <meta property="fb:app_id"              content={process.env.REACT_APP_FACEBOOK_APP_ID} />
                </Helmet>
                <div className="row">
                    <div className="col-sm-4">
                        <div className="carousel slide">
                            <Carousel>
                                {images}
                            </Carousel>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <h4>{title}</h4>
                        <small>{listing_date}</small>
                        <small> by <a href={seller_url}>{seller_name}</a></small>
                        <br/>
                        <Rate allowHalf disabled defaultValue={rating}/>
                        <br/>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<span><Icon type="profile"/>Description</span>} key="1">
                                <p>{description}</p>
                            </TabPane>
                            <TabPane tab={<span><Icon type="filter"/>Extra info</span>} key="2">
                                <table className="table">
                                    <tbody>
                                    {extra_information}
                                    </tbody>
                                </table>
                            </TabPane>
                        </Tabs>
                    </div>
                    <div className="p-2">
                        <h3>{price} {currency}</h3>
                        <InputNumber size="large" min={1} max={max_quantity} defaultValue={this.state.quantity_selected}
                                     onChange={this.new_quantity}/>
                        <br/>
                        <AddToCart title={title} quantity={this.state.quantity_selected} good_id={good._id}/>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const good_id = this.props.match.params.good_id;
        //TODO: implement back button
        //
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <Navbar/>
                        <br/>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item href="/">
                                <Icon type="home"/>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Icon type="search"/>
                                <span>Search results</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <br/>
                        <br/>
                        <Fragment>
                            <Query query={INDIVIDUALGOOD_QUERY} variables={{good_id}}>
                                {({data, loading, error}) => {
                                    if (loading) return <Skeleton loading={true} active avatar/>;
                                    if (error) console.log(error);
                                    if (data)return this.renderGood(data.individualGood);
                                }
                                }
                            </Query>
                        </Fragment>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}