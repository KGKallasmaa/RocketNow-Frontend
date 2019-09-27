import {Layout} from 'antd';
import React from "react";

const {Header, Content, Sider} = Layout;


export default class DashBoard extends React.Component {
    render() {
        return (
            <div>
                <body id="page-top">
                <div id="wrapper">
                    <div className="d-flex flex-column" id="content-wrapper">
                        <div id="content">
                            <nav className="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
                                <div className="container-fluid">
                                    <button className="btn btn-link d-md-none rounded-circle mr-3" id="sidebarToggleTop"
                                            type="button"><i className="fas fa-bars"/></button>
                                    <form
                                        className="form-inline d-none d-sm-inline-block mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                                        <div className="input-group"><input
                                            className="bg-light form-control border-0 small"
                                            type="text" placeholder="Search for ..."/>
                                            <div className="input-group-append">
                                                <button className="btn btn-primary py-0" type="button"><i
                                                    className="fas fa-search"/></button>
                                            </div>
                                        </div>
                                    </form>
                                    <ul className="nav navbar-nav flex-nowrap ml-auto">
                                        <li className="nav-item dropdown d-sm-none no-arrow"><a
                                            className="dropdown-toggle nav-link" data-toggle="dropdown"
                                            aria-expanded="false" href="#"><i className="fas fa-search"/></a>
                                            <div className="dropdown-menu dropdown-menu-right p-3 animated--grow-in"
                                                 role="menu" aria-labelledby="searchDropdown">
                                                <form className="form-inline mr-auto navbar-search w-100">
                                                    <div className="input-group"><input
                                                        className="bg-light form-control border-0 small" type="text"
                                                        placeholder="Search for ..."/>
                                                        <div className="input-group-append">
                                                            <button className="btn btn-primary py-0" type="button"><i
                                                                className="fas fa-search"/></button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </li>
                                        <li className="nav-item dropdown no-arrow mx-1" role="presentation">
                                            <li className="nav-item dropdown no-arrow"><a
                                                className="dropdown-toggle nav-link" data-toggle="dropdown"
                                                aria-expanded="false" href="#"/>
                                                <div
                                                    className="dropdown-menu dropdown-menu-right dropdown-list dropdown-menu-right animated--grow-in"
                                                    role="menu">
                                                    <h6 className="dropdown-header">alerts center</h6>
                                                    <a className="d-flex align-items-center dropdown-item" href="#">
                                                        <div className="mr-3">
                                                            <div className="bg-primary icon-circle"><i
                                                                className="fas fa-file-alt text-white"/></div>
                                                        </div>
                                                        <div><span
                                                            className="small text-gray-500">December 12, 2019</span>
                                                            <p>A new monthly report is ready to download!</p>
                                                        </div>
                                                    </a>
                                                    <a className="d-flex align-items-center dropdown-item" href="#">
                                                        <div className="mr-3">
                                                            <div className="bg-success icon-circle"><i
                                                                className="fas fa-donate text-white"/></div>
                                                        </div>
                                                        <div><span
                                                            className="small text-gray-500">December 7, 2019</span>
                                                            <p>$290.29 has been deposited into your account!</p>
                                                        </div>
                                                    </a>
                                                    <a className="d-flex align-items-center dropdown-item" href="#">
                                                        <div className="mr-3">
                                                            <div className="bg-warning icon-circle"><i
                                                                className="fas fa-exclamation-triangle text-white"/>
                                                            </div>
                                                        </div>
                                                        <div><span
                                                            className="small text-gray-500">December 2, 2019</span>
                                                            <p>Spending Alert: We've noticed unusually high spending for
                                                                your account.</p>
                                                        </div>
                                                    </a><a className="text-center dropdown-item small text-gray-500"
                                                           href="#">Show All Alerts</a></div>
                                            </li>
                                        </li>
                                        <li className="nav-item dropdown no-arrow mx-1" role="presentation">
                                            <li className="nav-item dropdown no-arrow"><a
                                                className="dropdown-toggle nav-link" data-toggle="dropdown"
                                                aria-expanded="false" href="#"/>
                                                <div
                                                    className="dropdown-menu dropdown-menu-right dropdown-list dropdown-menu-right animated--grow-in"
                                                    role="menu">
                                                    <h6 className="dropdown-header">alerts center</h6>
                                                    <a className="d-flex align-items-center dropdown-item" href="#">
                                                        <div className="dropdown-list-image mr-3"><img
                                                            className="rounded-circle"
                                                            src="assets/img/avatars/avatar4.jpeg"/>
                                                            <div className="bg-success status-indicator"/>
                                                        </div>
                                                        <div className="font-weight-bold">
                                                            <div className="text-truncate"><span>Hi there! I am wondering if you can help me with a problem I've been having.</span>
                                                            </div>
                                                            <p className="small text-gray-500 mb-0">Emily Fowler -
                                                                58m</p>
                                                        </div>
                                                    </a>
                                                    <a className="d-flex align-items-center dropdown-item" href="#">
                                                        <div className="dropdown-list-image mr-3"><img
                                                            className="rounded-circle"
                                                            src="assets/img/avatars/avatar2.jpeg"/>
                                                            <div className="status-indicator"/>
                                                        </div>
                                                        <div className="font-weight-bold">
                                                            <div className="text-truncate"><span>I have the photos that you ordered last month!</span>
                                                            </div>
                                                            <p className="small text-gray-500 mb-0">Jae Chun - 1d</p>
                                                        </div>
                                                    </a>
                                                    <a className="d-flex align-items-center dropdown-item" href="#">
                                                        <div className="dropdown-list-image mr-3"><img
                                                            className="rounded-circle"
                                                            src="assets/img/avatars/avatar3.jpeg"/>
                                                            <div className="bg-warning status-indicator"/>
                                                        </div>
                                                        <div className="font-weight-bold">
                                                            <div className="text-truncate"><span>Last month's report looks great, I am very happy with the progress so far, keep up the good work!</span>
                                                            </div>
                                                            <p className="small text-gray-500 mb-0">Morgan Alvarez -
                                                                2d</p>
                                                        </div>
                                                    </a>
                                                    <a className="d-flex align-items-center dropdown-item" href="#">
                                                        <div className="dropdown-list-image mr-3"><img
                                                            className="rounded-circle"
                                                            src="assets/img/avatars/avatar5.jpeg"/>
                                                            <div className="bg-success status-indicator"></div>
                                                        </div>
                                                        <div className="font-weight-bold">
                                                            <div className="text-truncate"><span>Am I a good boy? The reason I ask is because someone told me that people say this to all dogs, even if they aren't good...</span>
                                                            </div>
                                                            <p className="small text-gray-500 mb-0">Chicken the Dog ·
                                                                2w</p>
                                                        </div>
                                                    </a><a className="text-center dropdown-item small text-gray-500"
                                                           href="#">Show All Alerts</a></div>
                                            </li>
                                            <div className="shadow dropdown-list dropdown-menu dropdown-menu-right"
                                                 aria-labelledby="alertsDropdown"/>
                                        </li>
                                        <div className="d-none d-sm-block topbar-divider"/>
                                        <li className="nav-item dropdown no-arrow" role="presentation">
                                            <li className="nav-item dropdown no-arrow"><a
                                                className="dropdown-toggle nav-link" data-toggle="dropdown"
                                                aria-expanded="false" href="#"><span
                                                className="d-none d-lg-inline mr-2 text-gray-600 small">Employee nr 1</span><img
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
                                    <h3 className="text-dark mb-0">Dashboard</h3><a
                                    className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button"
                                    href="#"><i
                                    className="fas fa-download fa-sm text-white-50"/>Download yearly report</a></div>
                                <div className="row">
                                    <div className="col-md-6 col-xl-3 mb-4">
                                        <div className="card shadow border-left-primary py-2">
                                            <div className="card-body">
                                                <div className="row align-items-center no-gutters">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-uppercase text-primary font-weight-bold text-xs mb-1">
                                                            <span style={{color: "#1F96FE"}}>Earnings (monthly)</span>
                                                        </div>
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
                                        <div className="card shadow border-left-info py-2">
                                            <div className="card-body">
                                                <div className="row align-items-center no-gutters">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-uppercase text-info font-weight-bold text-xs mb-1">
                                                            <span>Orders delivered</span></div>
                                                        <div className="row no-gutters align-items-center">
                                                            <div className="col-auto">
                                                                <div
                                                                    className="text-dark font-weight-bold h5 mb-0 mr-3">
                                                                    <span>50%</span></div>
                                                            </div>
                                                            <div className="col">
                                                                <div className="progress progress-sm">
                                                                    <div className="progress-bar bg-info"
                                                                         aria-valuenow="50"
                                                                         aria-valuemin="0" aria-valuemax="100"
                                                                         style={{width: "50%"}}
                                                                    ><span
                                                                        className="sr-only">50%</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa-clipboard-list fa-2x text-gray-300"/></div>
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
                                                            <span>Unfullfilled orders</span></div>
                                                        <div className="text-dark font-weight-bold h5 mb-0">
                                                            <span>18</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto"><i
                                                        className="fas fa-comments fa-2x text-gray-300"/></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-7 col-xl-8">
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
                                        <div className="card shadow mb-4">
                                            <div
                                                className="card-header d-flex justify-content-between align-items-center">
                                                <h6 className="text-primary font-weight-bold m-0">Nr of orders</h6>
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
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 mb-4">
                                        <div className="card shadow mb-4">
                                            <div className="card-header py-3">
                                                <h6 className="text-primary font-weight-bold m-0">Orders</h6>
                                            </div>
                                            <div className="card-body">
                                                <h4 className="small font-weight-bold">Order nr 1<span
                                                    className="float-right">20%</span></h4>
                                                <div className="progress mb-4">
                                                    <div className="progress-bar bg-danger" aria-valuenow="20"
                                                         aria-valuemin="0" aria-valuemax="100" style={{width: "20%"}}><span
                                                        className="sr-only">20%</span></div>
                                                </div>
                                                <h4 className="small font-weight-bold">Order nr 2<span
                                                    className="float-right">40%</span></h4>
                                                <div className="progress mb-4">
                                                    <div className="progress-bar bg-warning" aria-valuenow="40"
                                                         aria-valuemin="0" aria-valuemax="100" style={{width: "40%"}}><span
                                                        className="sr-only">40%</span></div>
                                                </div>
                                                <h4 className="small font-weight-bold">Order nr 3<span
                                                    className="float-right">60%</span></h4>
                                                <div className="progress mb-4">
                                                    <div className="progress-bar bg-primary" aria-valuenow="60"
                                                         aria-valuemin="0" aria-valuemax="100" style={{width: "60%"}}><span
                                                        className="sr-only">60%</span></div>
                                                </div>
                                                <h4 className="small font-weight-bold">Order nr 4<span
                                                    className="float-right">80%</span></h4>
                                                <div className="progress mb-4">
                                                    <div className="progress-bar bg-info" aria-valuenow="80"
                                                         aria-valuemin="0" aria-valuemax="100" style={{width: "80%"}}><span
                                                        className="sr-only">80%</span></div>
                                                </div>
                                                <h4 className="small font-weight-bold">Order nr 5<span
                                                    className="float-right">Complete!</span></h4>
                                                <div className="progress mb-4">
                                                    <div className="progress-bar bg-success" aria-valuenow="100"
                                                         aria-valuemin="0" aria-valuemax="100"
                                                         style={{width: "100%"}}><span
                                                        className="sr-only">100%</span></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card shadow mb-4">
                                            <ul className="list-group list-group-flush"/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="row">
                                            <div className="col-lg-6 mb-4">
                                                <div className="card text-white bg-primary shadow">
                                                    <div className="card-body">
                                                        <p className="m-0">Download financial statement</p>
                                                        <p className="text-white-50 small m-0">#4e73df</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <div className="card text-white bg-success shadow">
                                                    <div className="card-body">
                                                        <p className="m-0">Success</p>
                                                        <p className="text-white-50 small m-0">#1cc88a</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <div className="card text-white bg-info shadow">
                                                    <div className="card-body">
                                                        <p className="m-0">Info</p>
                                                        <p className="text-white-50 small m-0">#36b9cc</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <div className="card text-white bg-warning shadow">
                                                    <div className="card-body">
                                                        <p className="m-0">Warning</p>
                                                        <p className="text-white-50 small m-0">#f6c23e</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <div className="card text-white bg-danger shadow">
                                                    <div className="card-body">
                                                        <p className="m-0">Danger</p>
                                                        <p className="text-white-50 small m-0">#e74a3b</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <div className="card text-white bg-secondary shadow">
                                                    <div className="card-body">
                                                        <p className="m-0">Secondary</p>
                                                        <p className="text-white-50 small m-0">#858796</p>
                                                    </div>
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
                </body>
            </div>
        );
    }
}
