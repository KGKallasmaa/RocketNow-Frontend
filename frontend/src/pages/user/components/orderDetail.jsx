import React from 'react';
import {Modal, Button, Steps, Icon} from 'antd';
import {getEmoji} from "../../../components/emoji";

const {Step} = Steps;
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const currency_display_dictionary = {
    'EUR': '€',
    'USD': '$',
    'RUB': '₽',
    'GBP': '£',
    'CNY': '¥',
    'JPY': '¥',
    'CHF': 'Fr'
};

function renderShippingAddress(shippingAddress) {
    if (shippingAddress === undefined){
        return "";
    }
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

function getStatus(order) {
    let status = ['finish', 'wait', 'wait', 'wait'];
    switch (order.status) {
        case "PROCESSING":
            status[1] = "finish";
            return status;
        case "PROCESSED":
            status[1] = "finish";
            status[2] = "finish";
            return status;
        case "SHIPPED":
            status[1] = "finish";
            status[2] = "finish";
            status[3] = "finish";
            return status;
        default:
            return status;
    }
}

function renderOrderItems(order) {
    if (order !== "") {
        return order.order_items.map(item => {
            return (
                <p>
                    {item.quantity} x <b>{item.title} </b> &nbsp;{currency_display_dictionary[item.currency]} {item.price_per_one_item}
                </p>
            );
        });
    }
    return (<p/>)
}

function timeConverter(UNIX_timestamp) {
    if (UNIX_timestamp === undefined) {
        return "";
    }
    const a = new Date(parseInt(UNIX_timestamp, 10));
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    return date + '.' + month + '.' + year;
};


export class UserOrderDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            order: "",
            receivedStatus: "finish",
            processingStatus: "wait",
            processedStatus: "wait",
            shippedStatus: "wait"
        };
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    componentDidMount() {
        let realOrder = undefined;
        for (let i = 0; i < this.props.rawData.length; i++) {
            const order = this.props.rawData[i];
            if (order._id === this.props.orderId) {
                realOrder = order;
                const status = getStatus(realOrder);
                this.setState({
                    order: order,
                    receivedStatus: status[0],
                    processingStatus: status[1],
                    processedStatus: status[2],
                    shippedStatus: status[3]
                });
                break;
            }
        }

    }

    render() {
        const {receivedStatus, processingStatus, processedStatus, shippedStatus, order} = this.state;
        const orderId = this.props.orderId;
        const receivedTime = timeConverter(order.received_timestamp_UTC);
        const processingStartTime = timeConverter(order.processing_start_timestamp_UTC);
        const processingEndTime = timeConverter(order.processing_end_timestamp_UTC);
        const shippedTime = timeConverter(order.shipped_timestamp_UTC);

        const tile = "Order " + orderId;
        const receiptURL = "receipt/order/" + orderId;
        const subtotal = order.subtotal;
        const shipping = order.shipping_cost;
        const taxes = order.tax_cost;
        const total = subtotal + shipping + taxes;
        return (
            <React.Fragment>
                <Button type="primary" onClick={this.showModal}>
                    Details
                </Button>
                <Modal
                    title={tile}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    width={700}
                    onCancel={this.handleCancel}
                >
                    <Steps size="small" current={1}>
                        <Step status={receivedStatus} title="Received" subTitle={receivedTime}
                              icon={<Icon type="shopping"/>}/>
                        <Step status={processingStatus} title="Processing" subTitle={processingStartTime}
                              icon={<Icon type="loading"/>}/>
                        <Step status={processedStatus} title="Proceeded" subTitle={processingEndTime}
                              icon={<Icon type="rocket"/>}/>
                        <Step status={shippedStatus} title="Shipped" subTitle={shippedTime}
                              icon={<Icon type="smile"/>}/>
                    </Steps>
                    <br/><br/>
                    <div className="row">
                        <div className="col-md-12">
                            <h3>Order contents</h3>
                            {renderOrderItems(order)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <h3>Shipping details</h3>
                            {renderShippingAddress(order.shippingAddress)}
                        </div>
                        <div className="col-md-6">
                            <h3>Summary</h3>
                            <p>Subtotal &nbsp;€{subtotal}</p>
                            <p>Shipping and Handling &nbsp;€{shipping}</p>
                            <p>Tax &nbsp;€{taxes}</p>
                            <b><p>Total &nbsp;€{total}</p></b>
                            <a href={receiptURL}>View the invoice</a>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
};