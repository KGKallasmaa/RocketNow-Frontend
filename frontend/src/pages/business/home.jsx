import React from "react";
import Menu from "./common/menu";
import "../../assets/css/business/admin.min.css";
import axios from "axios";
import {print} from "graphql";
import {message} from "antd";
import {THIS_YEAR_EXPENSES_QUERY} from "../../graphql/businessuser/dashboard/thisYearsExpenses_QUERY";
import {THIS_MONTH_EXPENSES_QUERY} from "../../graphql/businessuser/dashboard/thisMonthsExpenses_QUERY";
import {THIS_YEAR_REVENEU_QUERY} from "../../graphql/businessuser/dashboard/thisYearsReveneu_QUERY";
import {THIS_MONTH_REVENEU_QUERY} from "../../graphql/businessuser/dashboard/thisMonthsReveneu_QUERY";
import BusinessNavbar from "./common/navbar";
import BusinessFooter from "./common/footer";
import {Helmet} from "react-helmet";


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thisMonthsRevenue: 0,
            thisYearsRevenue: 0,
            thisMonthsExpenses: 0,
            thisYearsExpenses: 0
        };
        this.getThisMonthRevenue = this.getThisMonthRevenue.bind(this);
        this.getThisYearRevenue = this.getThisYearRevenue.bind(this);
        this.getThisMonthsExpenses = this.getThisMonthsExpenses.bind(this);
        this.getThisYearsExpenses = this.getThisYearsExpenses.bind(this);
    }

    getThisMonthRevenue() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(THIS_MONTH_REVENEU_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken_business")
            }
        }).then(res => {
                this.setState({
                    thisMonthsRevenue: res.data.data.thisMonthsRevenue
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

    getThisYearRevenue() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(THIS_YEAR_REVENEU_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken_business")
            }
        }).then(res => {
                this.setState({
                    thisYearsRevenue: res.data.data.thisYearsRevenue
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

    getThisMonthsExpenses() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(THIS_MONTH_EXPENSES_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken_business")
            }
        }).then(res => {
                this.setState({
                    thisMonthsExpenses: res.data.data.thisMonthsExpenses
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

    getThisYearsExpenses() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(THIS_YEAR_EXPENSES_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken_business")
            }
        }).then(res => {
                this.setState({
                    thisYearsExpenses: res.data.data.thisYearsExpenses
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
        this.getThisMonthRevenue();
        this.getThisMonthsExpenses();
        this.getThisYearRevenue();
        this.getThisYearsExpenses();
    }

    render() {
        const {thisMonthsRevenue, thisYearsRevenue, thisMonthsExpenses, thisYearsExpenses} = this.state;
        const cannonial_url = process.env.REACT_APP_PUBLIC_URL + "/business/home";
        return (
            <div id="page-top">
                <Helmet>
                    <title>Dashboard</title>
                    <meta property="og:title" content="Dashboard"/>
                    <link rel="canonial" href={cannonial_url}/>
                    <meta property="og:description"
                          content="View the performance of your RocketNow store"/>
                    <meta name="description" content="View the performance of your RocketNow store"/>
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
                                    <h3 className="text-dark mb-0">Dashboard</h3>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 col-xl-3 mb-4">
                                        <div className="card shadow border-left-primary py-2">
                                            <div className="card-body">
                                                <div className="row align-items-center no-gutters">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-uppercase text-primary font-weight-bold text-xs mb-1">
                                                            <span>Earnings (monthly)</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>€{thisMonthsRevenue} </span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa-calendar fa-2x text-gray-300"/></div>
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
                                                            <span>Fees (monthly)</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>€{thisMonthsExpenses}</span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa-calendar fa-2x text-gray-300"/></div>
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
                                                            <span>Earnings (annual)</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>€{thisYearsRevenue}</span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa-dollar-sign fa-2x text-gray-300"/></div>
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
                                                            <span>Fees (annual)</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>€{thisYearsExpenses}</span></div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa-dollar-sign fa-2x text-gray-300"/></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-7 col-xl-6">
                                        <div className="card shadow mb-4">
                                            <div
                                                className="card-header d-flex justify-content-between align-items-center">
                                                <h6 className="text-primary font-weight-bold m-0">Earnings Overview</h6>
                                                <div className="dropdown no-arrow">
                                                    <button className="btn btn-link btn-sm dropdown-toggle"
                                                            data-toggle="dropdown" aria-expanded="false" type="button">
                                                        <i
                                                            className="fas fa-ellipsis-v text-gray-400"/></button>
                                                    <div
                                                        className="dropdown-menu shadow dropdown-menu-right animated--fade-in"
                                                        role="menu">
                                                        <p className="text-center dropdown-header">dropdown header:</p>
                                                        <a
                                                            className="dropdown-item" role="presentation"
                                                            href="#">&nbsp;Action</a><a className="dropdown-item"
                                                                                        role="presentation"
                                                                                        href="#">&nbsp;Another
                                                        action</a>
                                                        <div className="dropdown-divider"/>
                                                        <a className="dropdown-item" role="presentation"
                                                           href="#">&nbsp;Something else here</a></div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="chart-area">
                                                    <canvas
                                                        data-bs-chart="{&quot;type&quot;:&quot;line&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;Jan&quot;,&quot;Feb&quot;,&quot;Mar&quot;,&quot;Apr&quot;,&quot;May&quot;,&quot;Jun&quot;,&quot;Jul&quot;,&quot;Aug&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;Earnings&quot;,&quot;fill&quot;:true,&quot;data&quot;:[&quot;0&quot;,&quot;10000&quot;,&quot;5000&quot;,&quot;15000&quot;,&quot;10000&quot;,&quot;20000&quot;,&quot;15000&quot;,&quot;25000&quot;],&quot;backgroundColor&quot;:&quot;rgba(78, 115, 223, 0.05)&quot;,&quot;borderColor&quot;:&quot;rgba(78, 115, 223, 1)&quot;}]},&quot;options&quot;:{&quot;maintainAspectRatio&quot;:false,&quot;legend&quot;:{&quot;display&quot;:false},&quot;title&quot;:{},&quot;scales&quot;:{&quot;xAxes&quot;:[{&quot;gridLines&quot;:{&quot;color&quot;:&quot;rgb(234, 236, 244)&quot;,&quot;zeroLineColor&quot;:&quot;rgb(234, 236, 244)&quot;,&quot;drawBorder&quot;:false,&quot;drawTicks&quot;:false,&quot;borderDash&quot;:[&quot;2&quot;],&quot;zeroLineBorderDash&quot;:[&quot;2&quot;],&quot;drawOnChartArea&quot;:false},&quot;ticks&quot;:{&quot;fontColor&quot;:&quot;#858796&quot;,&quot;padding&quot;:20}}],&quot;yAxes&quot;:[{&quot;gridLines&quot;:{&quot;color&quot;:&quot;rgb(234, 236, 244)&quot;,&quot;zeroLineColor&quot;:&quot;rgb(234, 236, 244)&quot;,&quot;drawBorder&quot;:false,&quot;drawTicks&quot;:false,&quot;borderDash&quot;:[&quot;2&quot;],&quot;zeroLineBorderDash&quot;:[&quot;2&quot;]},&quot;ticks&quot;:{&quot;fontColor&quot;:&quot;#858796&quot;,&quot;padding&quot;:20}}]}}}"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-7 col-xl-6">
                                        <div className="card shadow mb-4">
                                            <div
                                                className="card-header d-flex justify-content-between align-items-center">
                                                <h6 className="text-primary font-weight-bold m-0">Nr of Orders</h6>
                                                <div className="dropdown no-arrow">
                                                    <button className="btn btn-link btn-sm dropdown-toggle"
                                                            data-toggle="dropdown" aria-expanded="false" type="button">
                                                        <i className="fas fa-ellipsis-v text-gray-400"/></button>
                                                    <div
                                                        className="dropdown-menu shadow dropdown-menu-right animated--fade-in"
                                                        role="menu">
                                                        <p className="text-center dropdown-header">dropdown header:</p>
                                                        <a className="dropdown-item" role="presentation"
                                                           href="#">&nbsp;Action</a><a className="dropdown-item"
                                                                                       role="presentation"
                                                                                       href="#">&nbsp;Another action</a>
                                                        <div className="dropdown-divider"/>
                                                        <a className="dropdown-item" role="presentation"
                                                           href="#">&nbsp;Something else here</a></div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="chart-area">
                                                    <canvas
                                                        data-bs-chart="{&quot;type&quot;:&quot;bar&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;January&quot;,&quot;February&quot;,&quot;March&quot;,&quot;April&quot;,&quot;May&quot;,&quot;June&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;Revenue&quot;,&quot;backgroundColor&quot;:&quot;#4e73df&quot;,&quot;borderColor&quot;:&quot;#4e73df&quot;,&quot;data&quot;:[&quot;4512&quot;,&quot;5312&quot;,&quot;6251&quot;,&quot;7841&quot;,&quot;9821&quot;,&quot;14984&quot;]}]},&quot;options&quot;:{&quot;maintainAspectRatio&quot;:false,&quot;legend&quot;:{&quot;display&quot;:false},&quot;title&quot;:{},&quot;scales&quot;:{&quot;xAxes&quot;:[{&quot;gridLines&quot;:{&quot;color&quot;:&quot;rgb(234, 236, 244)&quot;,&quot;zeroLineColor&quot;:&quot;rgb(234, 236, 244)&quot;,&quot;drawBorder&quot;:false,&quot;drawTicks&quot;:false,&quot;borderDash&quot;:[&quot;2&quot;],&quot;zeroLineBorderDash&quot;:[&quot;2&quot;],&quot;drawOnChartArea&quot;:false},&quot;ticks&quot;:{&quot;fontColor&quot;:&quot;#858796&quot;,&quot;padding&quot;:20}}],&quot;yAxes&quot;:[{&quot;gridLines&quot;:{&quot;color&quot;:&quot;rgb(234, 236, 244)&quot;,&quot;zeroLineColor&quot;:&quot;rgb(234, 236, 244)&quot;,&quot;drawBorder&quot;:false,&quot;drawTicks&quot;:false,&quot;borderDash&quot;:[&quot;2&quot;],&quot;zeroLineBorderDash&quot;:[&quot;2&quot;]},&quot;ticks&quot;:{&quot;fontColor&quot;:&quot;#858796&quot;,&quot;padding&quot;:20}}]}}}"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 col-xl-6 mb-4">
                                        <div className="card shadow mb-4">
                                            <div className="card-header py-3">
                                                <h6 className="text-primary font-weight-bold m-0">Last 5 orders
                                                    recived</h6>
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
                                    <div className="col-lg-6 col-xl-6 mb-4">
                                        <div className="card shadow mb-4">
                                            <div className="card-header py-3">
                                                <h6 className="text-primary font-weight-bold m-0">Last 5 orders in
                                                    processing</h6>
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
                                    <div className="col-lg-6 col-xl-6 mb-4">
                                        <div className="card shadow mb-4">
                                            <div className="card-header py-3">
                                                <h6 className="text-primary font-weight-bold m-0">Last 5 orders in
                                                    transit</h6>
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
                                    <div className="col-lg-6 col-xl-6 mb-4">
                                        <div className="card shadow mb-4">
                                            <div className="card-header py-3">
                                                <h6 className="text-primary font-weight-bold m-0">Last 5 orders
                                                    delivered</h6>
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
                            </div>
                        </div>
                        <BusinessFooter/>
                    </div>
                </div>
            </div>
        );
    }
};