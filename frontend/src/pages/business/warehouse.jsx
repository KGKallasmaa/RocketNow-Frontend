import React from "react";
import Menu from "./common/menu";
import "../../assets/css/business/admin.min.css";
import axios from "axios";
import {print} from "graphql";
import {message} from "antd";
import BusinessNavbar from "./common/navbar";
import {formatTimeStamp} from "../../components/relativeTimestamp";
import BusinessFooter from "./common/footer";
import {WAREHOUSE_QUERY} from "../../graphql/businessuser/warehouse_QUERY";

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

function renderResults(good) {
    const product_url = "/goods/" + good.nr +"/"+ good.title;
    const empty_or_regular = ((good.quantity - good.booked) <= 0) ? "table-danger" : 0;
    GLOBAL_enumerator += 1;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today  = new Date(parseInt(good.listing_timestamp*1000));
    return (
        <tr className={empty_or_regular}>
            <th scope="row">{GLOBAL_enumerator}</th>
            <td><img className="product-big-img"  height={"150px"} src={good.main_image_cloudinary_secure_url}
                     alt={good.title}/></td>
            <td>{today.toLocaleDateString("en-US", options)}</td>
            <td><a href={product_url}>{good.title}</a></td>
            <td>{good.quantity}</td>
            <td>{good.booked}</td>
            <td>{currency_display_dictionary[good.currency]}{good.current_price}</td>
        </tr>
    );
}

function renderTableRows(goods) {
    if (goods) {
        return goods.map(good => {
            return renderResults(good)
        });
    }
    return "";
}

export default class Warehouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myWarehouseGoods: null,
            nrOfGoodsAvailable: 0,
            nrOfGoodsBooked: 0,
            warehouseGoodsValue: 0,
            lastUpdateTime: 0,
        };
        this.getMyWarehouseGoods = this.getMyWarehouseGoods.bind(this);
    }

    getMyWarehouseGoods() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(WAREHOUSE_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken_business")
            }
        }).then(res => {
                this.setState({
                    myWarehouseGoods: res.data.data.productsInWarehouse
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
        this.getMyWarehouseGoods();
    }

    render() {
        const {myWarehouseGoods, nrOfGoodsAvailable, nrOfGoodsBooked, warehouseGoodsValue, lastUpdateTime} = this.state;
        return (
            <div id="page-top">
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
                                    <h3 className="text-dark mb-0">Warehouse</h3>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 col-xl-3 mb-4">
                                        <div className="card shadow border-left-success py-2">
                                            <div className="card-body">
                                                <div className="row align-items-center no-gutters">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-uppercase text-success font-weight-bold text-xs mb-1">
                                                            <span>Nr of Goods available (TODO)</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>{nrOfGoodsAvailable} </span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa fa-cubes fa-2x text-gray-300"/></div>
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
                                                            <span>Nr of Goods booked (TODO)</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>{nrOfGoodsBooked}</span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa fa-cube fa-2x text-gray-300"/></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-xl-3 mb-4">
                                        <div className="card shadow border-left-primary py-2">
                                            <div className="card-body">
                                                <div className="row align-items-center no-gutters">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-uppercase text-primary font-weight-bold text-xs mb-1">
                                                            <span>Goods value (TODO)</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>{warehouseGoodsValue}</span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa-euro-sign fa-2x text-gray-300"/></div>
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
                                                            <span>Last updateTime (TODO)</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>{formatTimeStamp(lastUpdateTime)}</span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa-calendar fa-2x text-gray-300"/></div>
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
                                                <h6 className="text-primary font-weight-bold m-0">Warehouse goods</h6>
                                            </div>
                                            <div className="card-body">
                                                <table className="table table-striped table-hover">
                                                    <thead className="thead-dark">
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Main image</th>
                                                        <th scope="col">Listing date</th>
                                                        <th scope="col">Title</th>
                                                        <th scope="col">Quantity</th>
                                                        <th scope="col">Booked</th>
                                                        <th scope="col">Price</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {renderTableRows(myWarehouseGoods)}
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