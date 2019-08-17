import React, {Fragment} from "react";

import logo from '../../assets/img/logo.png';
import {Query} from "react-apollo";
import {Skeleton} from "antd";
import gql from "graphql-tag";

const PageLogo = () => {
    return (
        <div>
            <a title={"Homepage"} href="/">
                <img src={logo} style={{
                    width: "70px",
                    height: "70px",
                    paddingRight: "0px",
                    marginRight: "15px",
                    marginTop: "30px"
                }} alt="RocketNow logo"/>
            </a>
        </div>
    )
};

const OrderCard_QUERY = gql`
    query individualOrder($jwt_token:String!,$order_id:String) {
        individualOrder(jwt_token:$jwt_token,order_id:$order_id) {
            _id
            customer{
                email
            }
            shippingAddress{
                shippingName
            }
            received_timestamp_UTC
            subtotal
            shipping_cost
            tax_cost
            order_items{
                title
                price_per_one_item
                quantity
                currency
            }
        }
    }
`;

function formatNr(price) {
    return Math.round(100 * price) / 100;
}

const currency_display_dictionary = {
    "EUR": "€",
    "USD": "$",
    "RUB": "₽",
    "GBP": "£",
    "CNY": "¥",
    "JPY": "¥",
    "CHF": "Fr"
};

function timeConverter(UNIX_timestamp) {
    const a = new Date(parseInt(UNIX_timestamp, 10));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    return date + ' ' + month + ' ' + year;
}


export default class OrderReceipt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !nextState.subtotal;

    }

    renderRegularRow(orderGood) {
        const currency = currency_display_dictionary[orderGood.currency];
        return (
            <tr>
                <td>{orderGood.title}</td>
                <td>{orderGood.quantity}</td>
                <td>{currency}{formatNr(orderGood.price_per_one_item)}</td>
                <td>{currency}{formatNr(orderGood.price_per_one_item * orderGood.quantity)}</td>
            </tr>
        );
    }


    //TODO: add real VAT ID

    render() {
        const order_id = this.props.match.params.order_id;

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <PageLogo/>
                    </div>
                    <div className="col-md-6">
                    </div>
                </div>
                <div className="row">

                    <div className="col-md-6">
                        <h3>From</h3>
                        <p>RocketNow OÜ</p>
                        <p>Maakri 36</p>
                        <p>10145,Tallinn</p>
                        <p>Estonia</p>
                        <p>VAT Id: 12345</p>
                    </div>
                    <Fragment>
                        <Query query={OrderCard_QUERY}
                               variables={{
                                   jwt_token: sessionStorage.getItem("jwtToken"),
                                   order_id: this.props.match.params.order_id
                               }}>
                            {({data, loading, error}) => {
                                if (loading) return <Skeleton loading={true} active avatar/>;
                                if (data) {
                                    const base = data.individualOrder[0];
                                    const received_timestamp_UTC = timeConverter(base.received_timestamp_UTC);
                                    return (
                                        <div className="col-md-6">
                                            <h3>Details</h3>
                                            <p> OrderID: {order_id}</p>
                                            <p>Date of Issue:{received_timestamp_UTC}</p>
                                            <p>Payment received:{received_timestamp_UTC}</p>
                                        </div>
                                    );
                                }
                                return "";
                            }
                            }
                        </Query>
                    </Fragment>

                </div>
                <div className="row">
                    <Fragment>
                        <Query query={OrderCard_QUERY}
                               variables={{
                                   jwt_token: sessionStorage.getItem("jwtToken"),
                                   order_id: this.props.match.params.order_id
                               }}>
                            {({data, loading, error}) => {
                                if (loading) return <Skeleton loading={true} active avatar/>;
                                if (data) {
                                    const base = data.individualOrder[0];
                                    const email = base.customer.email;
                                    const fullname = base.shippingAddress.shippingName;
                                    return (
                                        <div className="col-md-6">
                                            <h3>To</h3>
                                            <p>{fullname}</p>
                                            <p>{email}</p>
                                        </div>
                                    );
                                }
                                return "";
                            }
                            }
                        </Query>
                    </Fragment>
                    <div className="col-md-6">
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            <Fragment>
                                <Query query={OrderCard_QUERY}
                                       variables={{
                                           jwt_token: sessionStorage.getItem("jwtToken"),
                                           order_id: this.props.match.params.order_id
                                       }}>
                                    {({data, loading, error}) => {
                                        if (loading) return <Skeleton loading={true} active avatar/>;
                                        if (data) {
                                            const base = data.individualOrder[0];
                                            if (base.order_items) {
                                                return base.order_items.map(this.renderRegularRow);
                                            }
                                            return "";

                                        }
                                        return "";
                                    }
                                    }
                                </Query>
                            </Fragment>
                            </tbody>
                        </table>
                        <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6">
                                <table className="table">
                                    <Fragment>
                                        <Query query={OrderCard_QUERY}
                                               variables={{
                                                   jwt_token: sessionStorage.getItem("jwtToken"),
                                                   order_id: this.props.match.params.order_id
                                               }}>
                                            {({data, loading, error}) => {
                                                if (loading) return <Skeleton loading={true} active avatar/>;
                                                if (data) {
                                                    const base = data.individualOrder[0];
                                                    const subtotal = formatNr(base.subtotal);
                                                    const shipping_cost = formatNr(base.shipping_cost);
                                                    const tax_cost = formatNr(base.tax_cost);
                                                    const total = formatNr(subtotal + shipping_cost + tax_cost);

                                                    return (
                                                        <tbody>
                                                        <tr>
                                                            <td>Subtotal</td>
                                                            <td>€{subtotal}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Shipping and Handling</td>
                                                            <td>€{shipping_cost}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Tax</td>
                                                            <td>€{tax_cost}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total</td>
                                                            <td>€{total}</td>
                                                        </tr>
                                                        </tbody>
                                                    );
                                                }
                                                return "";
                                            }
                                            }
                                        </Query>
                                    </Fragment>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}