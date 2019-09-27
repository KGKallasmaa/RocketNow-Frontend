import React from "react";
import Menu from "./common/menu";
import "../../assets/css/business/admin.min.css";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div id="page-top">
                <link rel="stylesheet"
                      href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"/>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css"/>
                <div id="businessWrapper">
                    <Menu/>
                    <div className="d-flex flex-column" id="content-wrapper">
                        <div id="content">
                            <nav className="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
                                <div className="container-fluid">
                                    <button className="btn btn-link d-md-none rounded-circle mr-3" id="sidebarToggleTop"
                                            type="button"><i className="fas fa-bars"/></button>
                                    <ul className="nav navbar-nav flex-nowrap ml-auto">


                                        <div className="d-none d-sm-block topbar-divider"/>
                                        <li className="nav-item dropdown no-arrow" role="presentation">
                                            <li className="nav-item dropdown no-arrow"><a
                                                className="dropdown-toggle nav-link" data-toggle="dropdown"
                                                aria-expanded="false" href="#"><span
                                                className="d-none d-lg-inline mr-2 text-gray-600 small">USER &nbsp;1 &nbsp;&nbsp;</span><img
                                                className="border rounded-circle img-profile"
                                                src="assets/img/avatars/avatar1.jpeg"/></a>
                                                <div
                                                    className="dropdown-menu shadow dropdown-menu-right animated--grow-in"
                                                    role="menu"><a className="dropdown-item" role="presentation"
                                                                   href="#"><i
                                                    className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"/>&nbsp;Profile</a><a
                                                    className="dropdown-item" role="presentation" href="#"><i
                                                    className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"/>&nbsp;Settings</a>
                                                    <a
                                                        className="dropdown-item" role="presentation" href="#"><i
                                                        className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"/>&nbsp;Activity
                                                        log</a>
                                                    <div className="dropdown-divider"/>
                                                    <a className="dropdown-item" role="presentation" href="#"><i
                                                        className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"/>&nbsp;Logout</a>
                                                </div>
                                            </li>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
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
                                                            <span>$40,000</span></div>
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
                                                            <span>$4,000</span></div>
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
                                                            <span>$215,000</span></div>
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
                                                            <span>$21,500</span></div>
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
                                                        <div className="dropdown-divider"></div>
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
                        <footer className="bg-white sticky-footer">
                            <div className="container my-auto">
                                <div className="text-center my-auto copyright"><span>Copyright © RocketNow 2019</span>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
};