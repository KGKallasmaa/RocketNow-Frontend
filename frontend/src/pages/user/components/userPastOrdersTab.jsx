import React from 'react';
import {Button, Empty, Skeleton, Table, Tag} from 'antd';
import {fetchData} from "../../../common/fetcher";
import {OrderCard_QUERY} from "../graphql/orderCard_QUERY";
import noOrders from "../assets/img/noOrders.png";
import {UserOrderDetail} from "./orderDetail";

const {Column} = Table;
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const img_style = {
    maxHeight: "150px"
};

function timeConverter(UNIX_timestamp) {
    const a = new Date(parseInt(UNIX_timestamp, 10));
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    return date + '.' + month + '.' + year;
};


function renderData(raw_data) {
    let data = [];
    for (let i = 0; i < raw_data.length; i++) {
        const singleOrder = raw_data[i];
        let previewImages = [];
        singleOrder.order_items.sort((a, b) => a.quantity - b.quantity);
        for (let j = 0; j < singleOrder.order_items.length; j++) {
            if (j < 2) {
                previewImages[j] = singleOrder.order_items[j].main_image_cloudinary_secure_url;
            }
        }

        data[i] = {
            preview: previewImages,
            date: timeConverter(singleOrder.received_timestamp_UTC),
            status: [singleOrder.status],
            nr: [singleOrder._id]
        };
    }
    if (data.length === 0) {
        return "-1";
    }
    return data;
}

export class UserPastOrdersTab extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: ""
        };
    }

    async componentDidMount() {
        const variables = {
            jwt_token: sessionStorage.getItem("jwtToken")
        };
        let fetchPastOrderData = fetchData(variables, OrderCard_QUERY);
        let orderData = await fetchPastOrderData;
        if (orderData !== null) {
            const raw_data = orderData.individualOrder;
            this.setState({
                data: renderData(raw_data),
                rawData:raw_data,
            });
        }
    }


    render() {
        if (this.state.data === "-1") {
            return (
                <Empty
                    image={noOrders}
                    imageStyle={{
                        height: 180,
                    }}
                    description={
                        <span>You haven't ordered anything yet</span>
                    }
                >
                    <Button href={"/"} type="primary">Start shopping</Button>
                </Empty>
            );
        } else {
            if (this.state.data !== undefined) {
                return (
                    <React.Fragment>
                        <Table dataSource={this.state.data}>
                            <Column title="Preview" dataIndex="preview" key="preview"
                                    render={preview => (
                                        <span>
                                            {preview.map(preview => (
                                                <img style={img_style} src={preview}/>
                                            ))}
                                        </span>
                                    )}
                            />
                            <Column title="Order Date" dataIndex="date" key="date"/>
                            <Column title="Status" dataIndex="status" key="status"
                                    render={status => (
                                        <span>
                                            {status.map(status => (
                                                <Tag color="blue" key={status}>
                                                    {status}
                                                </Tag>
                                            ))}
                                        </span>
                                    )}
                            />
                            <Column title="View" dataIndex="nr" key="nr"
                                    render={nr => (
                                        <span>
                                            {nr.map(nr => (
                                                <UserOrderDetail  rawData={this.state.rawData} orderId={nr}/>
                                            ))}
                                        </span>
                                    )}
                            />
                        </Table>
                    </React.Fragment>
                );
            }
            return (
                <React.Fragment>
                    <Skeleton rows={3} loading={true} active avatar/>
                    <hr/>
                    <Skeleton rows={3} loading={true} active avatar/>
                    <hr/>
                    <Skeleton rows={3} loading={true} active avatar/>
                    <hr/>
                </React.Fragment>
            );
        }

    }
};