import React, {Fragment} from "react";
import gql from "graphql-tag";
import {Query} from "react-apollo";
import { Icon , Skeleton, Steps, message} from "antd";
import {Helmet} from "react-helmet";
import Footer from "../navbarAndFooter/Footer.jsx";
import Navbar from "../navbarAndFooter/Navbar.jsx";

const {Step} = Steps;

const Order_QUERY = gql`
    query orderGoods($jwt_token: String!,$success_id:String!) {
        orderGoods(orderInput:{jwt_token: $jwt_token,success_id:$success_id}) {
            order_items{
                _id
                title
                main_image_cloudinary_secure_url
            }
        }
    }
`;


const OrderGoodCard = (good) => {
    return (
        <div className="col-sm-6 col-md-5 col-lg-4 item">
            <div className="box" style={{width: "100%"}}>
                <img src={good.image} alt={good.title}
                     style={{maxWidth: "100%", maxHeight: "200px"}}/>
                <h3 className="name">{good.title}</h3>
                <br/> <br/> <br/>
            </div>
        </div>
    );
};

export default class Success extends React.Component {
    render() {
        const CannonialUrl = process.env.REACT_APP_CLIENT_URL + "/success/" + this.props.match.params.success_id;
        return (
            <div>
                <Navbar/>
                <Helmet>
                    <title>Thank you from RocketNow</title>
                    <link rel="canonial" href={CannonialUrl}/>
                </Helmet>
                <div className="features-boxed">
                    <div className="container">
                        <div className="intro">
                            <h2 className="text-center">Thank you for ordering</h2>
                            <div className="steps-progressbar">
                                <Steps direction="horizontal" current={1} status="finish" size="default">
                                    <Step title="Payment"/>
                                    <Step title="Processing" icon={<Icon type="loading"/>}/>
                                    <Step title="Shipped" icon={<Icon type="rocket"/>}/>
                                    <Step title="Delivered" icon={<Icon type="smile"/>}/>
                                </Steps>
                            </div>
                            <br/>
                            <p className="text-center">We have received your order and deliver it as soon as
                                possible.</p>
                            <br/>
                        </div>
                        <div className="row justify-content-center features">
                            <Fragment>
                                <Query query={Order_QUERY}
                                       variables={{
                                           jwt_token: sessionStorage.getItem("jwtToken"),
                                           success_id: this.props.match.params.success_id
                                       }}>
                                    {({data, loading, error}) => {
                                        if (loading) return <Skeleton loading={true} active avatar/>;
                                        if (error) message.error(error);
                                        if (data) {
                                            return data.orderGoods.order_items.map(good => {
                                                return <OrderGoodCard image={good.main_image_cloudinary_secure_url}
                                                                      title={good.title}/>
                                            });
                                        }
                                        return "";
                                    }
                                    }
                                </Query>
                            </Fragment>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}