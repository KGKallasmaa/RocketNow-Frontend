import React from "react";
import logo from '../../assets/img/logo.svg';
import {Helmet} from "react-helmet";
import {OrderCard_QUERY} from "../../graphql/orderCard_QUERY";
import {currency_symbol_converter} from "../../components/currency_and_symbol";
import {fetchData} from "../../common/fetcher";
import Skeleton from "antd/es/skeleton";

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


function formatNr(price) {
    return Math.round(100 * price) / 100;
}

function renderRegularRow(orderGood) {
    const currency = currency_symbol_converter[orderGood.currency];
    return (
        <tr>
            <td>{orderGood.title}</td>
            <td>{orderGood.quantity}</td>
            <td>{currency}{formatNr(orderGood.price_per_one_item)}</td>
            <td>{currency}{formatNr(orderGood.price_per_one_item * orderGood.quantity)}</td>
        </tr>
    );
}


function timeConverter(UNIX_timestamp) {
    const a = new Date(parseInt(UNIX_timestamp, 10));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    return date + ' ' + month + ' ' + year;
}


class CompletedOrderReceipt extends React.PureComponent {

    render() {
        const received_timestamp_UTC = timeConverter(this.props.base.received_timestamp_UTC);
        const subtotal = formatNr(this.props.base.subtotal);
        const shipping_cost = formatNr(this.props.base.shipping_cost);
        const tax_cost = formatNr(this.props.base.tax_cost);
        const total = formatNr(subtotal + shipping_cost + tax_cost);
        const order_items = this.props.base.order_items;
        return (
            <div className="container-fluid">
                <Helmet>
                    <title>Order nr {this.props.order_id}</title>
                    <meta name="description" content="View the order you made at RocketNow"/>
                </Helmet>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-1"/>
                        <div className="col-md-5">
                            <PageLogo/>
                        </div>
                        <div className="col-md-5"/>
                        <div className="col-md-1"/>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-1"/>
                        <div className="col-md-5">
                            <h3>From</h3>
                            <p>RocketNow OÜ</p>
                            <p>Maakri 36</p>
                            <p>10145,Tallinn</p>
                            <p>Estonia</p>
                            <p>VAT Id: 12345</p>
                        </div>
                        <div className="col-md-2"/>
                        <div className="col-md-3">
                            <h3>Details</h3>
                            <p> OrderID: {this.props.order_id}</p>
                            <p>Date of Issue:{received_timestamp_UTC}</p>
                            <p>Payment received:{received_timestamp_UTC}</p>
                        </div>
                        <div className="col-md-1"/>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-1"/>
                        <div className="col-md-5">
                            <h3>To</h3>
                            <p>{this.props.base.shippingAddress.shippingName}</p>
                            <p>{this.props.base.customer.email}</p>
                        </div>
                        <div className="col-md-5"/>
                        <br/><br/><br/><br/><br/>
                    </div>
                </div>
                <br/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-1"/>
                        <div className="col-md-10">
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
                                {(order_items !== undefined) ? order_items.map(renderRegularRow) : <p/>}
                                </tbody>
                            </table>
                            <div className="row">
                                <div className="col-md-6">
                                </div>
                                <div className="col-md-6">
                                    <table className="table">
                                        <tbody>
                                        <tr>
                                            <td><b>Subtotal</b></td>
                                            <td>€{subtotal}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Shipping and Handling</b></td>
                                            <td>€{shipping_cost}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Tax</b></td>
                                            <td>€{tax_cost}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Total</b></td>
                                            <td>€{total}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-1"/>
                    </div>
                </div>
            </div>
        );
    }
}


export default class OrderReceipt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextState.base !== undefined;
    }

    async componentDidMount() {
        const variables = {
            jwt_token: sessionStorage.getItem("jwtToken"),
            order_id: this.props.match.params.order_id
        };
        let fetchIndividualOrder = fetchData(variables, OrderCard_QUERY);
        let individualOrder = await fetchIndividualOrder;
        if (individualOrder !== null) {
            this.setState({
                base: individualOrder.individualOrder[0]
            });
        }
    }
    render() {
        const order_id = this.props.match.params.order_id;
        const {base} = this.state;
        if (base !== undefined) {
            return (
                <CompletedOrderReceipt order_id={order_id} base={base}/>
            );
        }
        return (
            <div className="container-fluid">
                <Helmet>
                    <title>Order nr {order_id}</title>
                    <meta name="description" content="View the order you made at RocketNow"/>
                </Helmet>
                <div className="row">
                    <div className="col-md-6">
                        <PageLogo/>
                    </div>
                    <div className="col-md-6"/>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <Skeleton rows={5} active={true}/>
                    </div>
                    <div className="col-md-6">
                        <Skeleton rows={4} active={true}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <Skeleton rows={3} active={true}/>
                    </div>
                    <div className="col-md-6"/>
                    <br/><br/><br/><br/><br/>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <table className="table">
                            <Skeleton rows={8} active={true}/>
                        </table>
                        <div className="row">
                            <div className="col-md-6"/>
                            <div className="col-md-6">
                                <table className="table">
                                    <tbody>
                                    <tr><Skeleton rows={1} active={true}/></tr>
                                    <tr><Skeleton rows={1} active={true}/></tr>
                                    <tr><Skeleton rows={1} active={true}/></tr>
                                    <tr><Skeleton rows={1} active={true}/></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
//TODO: add real VAT ID
