import React from "react";
import gql from "graphql-tag";
import {Icon, Steps, message} from "antd";
import {Helmet} from "react-helmet";
import Footer from "../../components/footer.jsx";
import {Navbar} from "../../components/navbar.jsx";
import axios from "axios";
import {print} from "graphql";
import AcceptsCookies from "../../components/legal/cookie_consent";

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

function renderOrdergoods(ordergoods) {
    if (ordergoods) {
        return ordergoods.map(good => {
            return <OrderGoodCard image={good.main_image_cloudinary_secure_url}
                                  title={good.title}/>
        });
    }
    return "";
}

export default class Success extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ordergoods: null,
        };
        this.makeAnOrder = this.makeAnOrder.bind(this);
    }

    makeAnOrder() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(Order_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken"),
                success_id: this.props.match.params.success_id
            }
        }).then(res => {
                this.setState({
                    ordergoods:res.data.data.orderGoods.order_items
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
    componentDidMount() {
        this.makeAnOrder();
    }

    render() {
        const CannonialUrl = process.env.REACT_APP_CLIENT_URL + "/success/" + this.props.match.params.success_id;
        const {ordergoods} = this.state;
        return (
            <div>
                <Navbar/>
                <br/><br/>
                <Helmet>
                    <title>Thank you from RocketNow</title>
                    <link rel="canonial" href={CannonialUrl}/>
                </Helmet>
                <AcceptsCookies/>
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
                            <p className="text-center">
                                We have received your order and deliver it as soon as possible.
                            </p>
                            <br/>
                        </div>
                        <div className="row justify-content-center features">
                            {renderOrdergoods(ordergoods)}
                        </div>
                    </div>
                </div>
                <br/><br/><br/>
                <Footer/>
            </div>
        );
    }
}