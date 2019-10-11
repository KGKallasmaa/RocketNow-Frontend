import React from "react";
import Menu from "./common/menu";
import "../../assets/css/business/admin.min.css";
import axios from "axios";
import {print} from "graphql";
import {message, Select} from "antd";
import BusinessNavbar from "./common/navbar";
import {formatTimeStamp} from "../../components/relativeTimestamp";
import BusinessFooter from "./common/footer";
import {PARTIALORDER_QUERY} from "../../graphql/businessuser/order/partialOrder_QUERY";
import {NR_OF_ORDERDS_PROCESSING_NOT_STARTED_QUERY} from "../../graphql/businessuser/order/nrOfOrderdsProcessingNotStarted_QUERY";
import {NR_OF_NOT_SHIPPED_ORDERS_QUERY} from "../../graphql/businessuser/order/nrOfNotShippedOrders_QUERY";
import {UN_COMPLETED_ORDERS_VALUE_QUERY} from "../../graphql/businessuser/order/unCompletedOrdersValue_QUERY";
import {NR_OF_IN_PROGRESS_ORDERS_QUERY} from "../../graphql/businessuser/order/nrOfInProgressOrders_QUERY";
import {Helmet} from "react-helmet";
import {UPDATE_PARTIAL_ORDER_STATUS} from "../../graphql/businessuser/order/updatePartialOrderStatus_MUTATION";
import {getEmoji} from "../../components/emoji";

const {Option} = Select;
let GLOBAL_enumerator = 0;

const currency_display_dictionary = {
    'EUR': '€',
    'USD': '$',
    'RUB': '₽',
    'GBP': '£',
    'CNY': '¥',
    'JPY': '¥',
    'CHF': 'Fr'
};

function renderPartialOrderGoods(ordergoods) {
    if (ordergoods) {
        return ordergoods.map(ordergood => {
            return (
                <div>
                    <p><b>Title:</b> {ordergood.title}</p>
                    <p><b>Price:</b> {currency_display_dictionary[ordergood.currency]}{ordergood.price_per_one_item}</p>
                    <p><b>Quantity:</b> {ordergood.quantity}</p>
                </div>
            );
        });
    }
    return "";
}

function renderShippingAddress(shippingAddress) {
    if (shippingAddress.shippingMethod === "ParcelDelivery") {
        return (
            <div>
                <b>To:</b> {shippingAddress.shippingName} <br/>
                <b>Location:</b> {shippingAddress.parcelDeliveryLocation.name} {getEmoji(shippingAddress.parcelDeliveryLocation.country)}<br/>
                <b>Provider:</b> {shippingAddress.parcelDeliveryLocation.provider} <br/>
            </div>
        );
    } else if (shippingAddress.shippingMethod === "AddressDelivery") {
        return (
            <div>
                <b>To:</b> {shippingAddress.shippingName} <br/>
                <b>Address Line 1:</b> {shippingAddress.addressOne} <br/>
                <b>Address Line 2:</b> {shippingAddress.addressTwo} <br/>
                <b>City:</b> {shippingAddress.city} <br/>
                <b>Zip</b> {shippingAddress.zip} <br/>
                <b>Region</b> {shippingAddress.region} <br/>
                <b>Country</b> {shippingAddress.country}{getEmoji(shippingAddress.country)} <br/>
            </div>
        );
    }
}

function getOptionValues(currentStatus) {
    let optionValues = [];
    if (currentStatus === "RECEIVED") {
        const options = [
            <Option value="RECEIVED">RECEIVED</Option>,
            <Option value="PROCESSING">PROCESSING</Option>,
            <Option value="PROCESSED" disabled>PROCESSED</Option>,
            <Option value="SHIPPED" disabled>SHIPPED</Option>
        ];
        optionValues = optionValues.concat(options);
    } else if (currentStatus === "PROCESSING") {
        const options = [
            <Option value="RECEIVED" disabled>RECEIVED</Option>,
            <Option value="PROCESSING">PROCESSING</Option>,
            <Option value="PROCESSED">PROCESSED</Option>,
            <Option value="SHIPPED" disabled>SHIPPED</Option>
        ];
        optionValues = optionValues.concat(options);
    } else if (currentStatus === "PROCESSED") {
        const options = [
            <Option value="RECEIVED" disabled>RECEIVED</Option>,
            <Option value="PROCESSING" disabled>PROCESSING</Option>,
            <Option value="PROCESSED">PROCESSED</Option>,
            <Option value="SHIPPED">SHIPPED</Option>
        ];
        optionValues = optionValues.concat(options);
    }
    return optionValues;
}


class PartialOrder extends React.Component {
    constructor(props) {
        super(props);
        this.updateOrderStatus = this.updateOrderStatus.bind(this);
    }

    updateOrderStatus(newStatus) {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(UPDATE_PARTIAL_ORDER_STATUS),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken_business"),
                partialOrderId: this.props.partialOrder.partialOrder._id,
                newStatus: newStatus
            }
        }).then(() => {
                message.success("Your order status was updated to " + newStatus);
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
        const base = this.props.partialOrder;
        const partialOrder = base.partialOrder;
        const shippingAddress = base.shippingAddress;
        GLOBAL_enumerator += 1;
        const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        const offset = new Date().getTimezoneOffset();
        const offsetInMs = offset * 60 * 60 * 1000;
        const recivedTime = new Date(parseInt(partialOrder.received_timestamp_UTC + offsetInMs));

        let proccesingStartTime = undefined;
        if (partialOrder.processing_start_timestamp_UTC) {
            proccesingStartTime = new Date(parseInt(partialOrder.processing_start_timestamp_UTC + offsetInMs));
        }
        let proccesingEndTime = undefined;
        if (partialOrder.processing_end_timestamp_UTC) {
            proccesingEndTime = new Date(parseInt(partialOrder.processing_end_timestamp_UTC + offsetInMs));
        }
        let shippedTime = undefined;
        if (partialOrder.shipped_timestamp_UTC) {
            shippedTime = new Date(parseInt(partialOrder.shipped_timestamp_UTC + offsetInMs));
        }

        return (
            <tr>
                <th scope="row">{GLOBAL_enumerator}</th>
                <td>{partialOrder._id}</td>
                <td>
                    <Select defaultValue={partialOrder.partial_order_status} style={{width: 120}}
                            onChange={this.updateOrderStatus}>
                        {getOptionValues(partialOrder.partial_order_status)}
                    </Select>
                </td>
                <td>
                    <b>Order
                        received:</b> {recivedTime.toLocaleDateString("en-US", options)} ({formatTimeStamp(recivedTime)}) <br/>
                    {(proccesingStartTime !== undefined) ? <b>Processing started:</b> : <p/>}
                    {(proccesingStartTime !== undefined) ? proccesingStartTime.toLocaleDateString("en-US", options) :
                        <p/>}
                    {(proccesingStartTime !== undefined) ? " (" + formatTimeStamp(proccesingStartTime) + ")" : <p/>}
                    <br/>
                    {(proccesingEndTime !== undefined) ? <b>Processing ended:</b> : <p/>}
                    {(proccesingEndTime !== undefined) ? proccesingEndTime.toLocaleDateString("en-US", options) : <p/>}
                    {(proccesingEndTime !== undefined) ? " (" + formatTimeStamp(proccesingEndTime) + ")" : <p/>}
                    <br/>
                    {(shippedTime !== undefined) ? <b>Shipped:</b> : <p/>}
                    {(shippedTime !== undefined) ? shippedTime.toLocaleDateString("en-US", options) : <p/>}
                    {(shippedTime !== undefined) ? " (" + formatTimeStamp(shippedTime) + ")" : <p/>}
                    <br/>
                </td>
                <td>
                    {renderPartialOrderGoods(partialOrder.order_items)}
                </td>
                <td>{renderShippingAddress(shippingAddress)}</td>
            </tr>
        );
    }
}

function renderTableRows(partialOrders) {
    if (partialOrders) {
        return partialOrders.map(partialOrder => {
            return <PartialOrder partialOrder={partialOrder}/>
        });
    }
    return "";
}


export default class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myPartialOrders: undefined,
            nrOfOrdersProcessingNotStarted: 0,
            nrOfInProgressOrders: 0,
            nrOfNotShippedOrders: 0,
            unCompletedOrdersValue: 0,
        };
        this.getMyPartialOrders = this.getMyPartialOrders.bind(this);
        this.getNrOfInProgressOrders = this.getNrOfInProgressOrders.bind(this);
        this.getNrOfOrdersProcessingNotStarted = this.getNrOfOrdersProcessingNotStarted.bind(this);
        this.getNrOfNotShippedOrders = this.getNrOfNotShippedOrders.bind(this);
        this.getUnCompletedOrdersValue = this.getUnCompletedOrdersValue.bind(this);
    }

    getNrOfInProgressOrders() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(NR_OF_IN_PROGRESS_ORDERS_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken_business")
            }
        }).then(res => {
                this.setState({
                    nrOfInProgressOrders: res.data.data.nrOfInProgressOrders
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

    getNrOfOrdersProcessingNotStarted() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(NR_OF_ORDERDS_PROCESSING_NOT_STARTED_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken_business")
            }
        }).then(res => {
                this.setState({
                    nrOfOrdersProcessingNotStarted: res.data.data.nrOfOrdersProcessingNotStarted
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

    getNrOfNotShippedOrders() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(NR_OF_NOT_SHIPPED_ORDERS_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken_business")
            }
        }).then(res => {
                this.setState({
                    nrOfNotShippedOrders: res.data.data.nrOfNotShippedOrders
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

    getUnCompletedOrdersValue() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(UN_COMPLETED_ORDERS_VALUE_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken_business")
            }
        }).then(res => {
                this.setState({
                    unCompletedOrdersValue: res.data.data.unCompletedOrdersValue
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

    getMyPartialOrders() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(PARTIALORDER_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken_business")
            }
        }).then(res => {
                this.setState({
                    excpandedPartialOrders: res.data.data.partialOrdersNotYetShipped
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
        GLOBAL_enumerator = 0;
        this.getMyPartialOrders();
        this.getNrOfInProgressOrders();
        this.getNrOfOrdersProcessingNotStarted();
        this.getNrOfNotShippedOrders();
        this.getUnCompletedOrdersValue();
    }

    render() {
        const {
            excpandedPartialOrders,
            nrOfOrdersProcessingNotStarted,
            nrOfInProgressOrders,
            nrOfNotShippedOrders,
            unCompletedOrdersValue
        } = this.state;
        const cannonial_url = process.env.REACT_APP_PUBLIC_URL + "/business/orders";
        return (
            <div id="page-top">
                <Helmet>
                    <title>Orders</title>
                    <meta property="og:title" content="Orders"/>
                    <link rel="canonial" href={cannonial_url}/>
                    <meta property="og:description"
                          content="Manage your orders from the RocketNow store"/>
                    <meta name="description" content="Manage your orders from the RocketNow store"/>
                </Helmet>

                <link rel="stylesheet"
                      href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"/>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css"/>
                <div id="businessWrapper">
                    <Menu/>
                    <div className="d-flex flex-column" id="content-wrapper">
                        <div id="content">
                            <BusinessNavbar/>
                            <div className="container-fluid">
                                <div className="d-sm-flex justify-content-between align-items-center mb-4">
                                    <h3 className="text-dark mb-0">Orders</h3>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 col-xl-3 mb-4">
                                        <div className="card shadow border-left-error py-2">
                                            <div className="card-body">
                                                <div className="row align-items-center no-gutters">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-uppercase text-error font-weight-bold text-xs mb-1">
                                                            <span>Processing not started</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>{nrOfOrdersProcessingNotStarted} </span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa fa-hourglass-start fa-2x text-gray-300"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-xl-3 mb-4">
                                        <div className="card shadow border-left-warning py-2">
                                            <div className="card-body">
                                                <div className="row align-items-center no-gutters">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-uppercase text-warning font-weight-bold text-xs mb-1">
                                                            <span>InProgress orders</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>{nrOfInProgressOrders}</span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa-tasks fa-2x text-gray-300"/></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-xl-3 mb-4">
                                        <div className="card shadow border-left-info py-2">
                                            <div className="card-body">
                                                <div className="row align-items-center no-gutters">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-uppercase text-info font-weight-bold text-xs mb-1">
                                                            <span>Not shipped orders</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>{nrOfNotShippedOrders}</span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa-truck fa-2x text-gray-300"/></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-xl-3 mb-4">
                                        <div className="card shadow border-left-success py-2">
                                            <div className="card-body">
                                                <div className="row align-items-center no-gutters">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-uppercase text-success font-weight-bold text-xs mb-1">
                                                            <span>Uncompleted orders value</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>{unCompletedOrdersValue}</span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa-euro-sign fa-2x text-gray-300"/></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-xl-12 mb-4">
                                        <div className="card shadow mb-4">
                                            <div className="card-header py-3">
                                                <h6 className="text-primary font-weight-bold m-0">Re stock on
                                                    (TODO)</h6>
                                            </div>
                                            <div className="card-body">
                                                <h4 className="small font-weight-bold">Server migration<span
                                                    className="float-right">20%</span></h4>
                                                <div className="progress mb-4">
                                                    <div className="progress-bar bg-danger" aria-valuenow="20"
                                                         aria-valuemin="0" aria-valuemax="100"
                                                         style={{width: "20%"}}><span

                                                        className="sr-only">20%</span></div>
                                                </div>
                                                <h4 className="small font-weight-bold">Sales tracking<span
                                                    className="float-right">40%</span></h4>
                                                <div className="progress mb-4">
                                                    <div className="progress-bar bg-warning" aria-valuenow="40"
                                                         aria-valuemin="0" aria-valuemax="100"
                                                         style={{width: "40%"}}><span
                                                        className="sr-only">40%</span></div>
                                                </div>
                                                <h4 className="small font-weight-bold">Customer Database<span
                                                    className="float-right">60%</span></h4>
                                                <div className="progress mb-4">
                                                    <div className="progress-bar bg-primary" aria-valuenow="60"
                                                         aria-valuemin="0" aria-valuemax="100"
                                                         style={{width: "60%"}}><span
                                                        className="sr-only">60%</span></div>
                                                </div>
                                                <h4 className="small font-weight-bold">Payout Details<span
                                                    className="float-right">80%</span></h4>
                                                <div className="progress mb-4">
                                                    <div className="progress-bar bg-info" aria-valuenow="80"
                                                         aria-valuemin="0" aria-valuemax="100"
                                                         style={{width: "80%"}}><span
                                                        className="sr-only">80%</span></div>
                                                </div>
                                                <h4 className="small font-weight-bold">Account setup<span
                                                    className="float-right">Complete!</span></h4>
                                                <div className="progress mb-4">
                                                    <div className="progress-bar bg-success" aria-valuenow="100"
                                                         aria-valuemin="0" aria-valuemax="100"
                                                         style={{width: "100%"}}><span
                                                        className="sr-only">100%</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-xl-12 mb-4">
                                        <div className="card shadow mb-4">
                                            <div className="card-header py-3">
                                                <h6 className="text-primary font-weight-bold m-0">Partial orders</h6>
                                            </div>
                                            <div className="card-body">
                                                <table className="table table-striped table-hover">
                                                    <thead className="thead-dark">
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Partial Order Id</th>
                                                        <th scope="col">Current status</th>
                                                        <th scope="col">Dates</th>
                                                        <th scope="col">Items</th>
                                                        <th scope="col">Shipping info</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {renderTableRows(excpandedPartialOrders)}
                                                    {(!excpandedPartialOrders) ? <p>Loading ...</p> : <p/>}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <BusinessFooter/>
                    </div>
                </div>
            </div>
        );
    }
};
//TODO: shipping info should include mobile phone nr as well