import React from "react";

export default function Menu() {
    return (
        <nav
            className="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0"
            style={{backgroundColor: "#1F96FE"}}>
            <div className="container-fluid d-flex flex-column p-0">
                <a className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
                   href="/business/home">
                    <div className="sidebar-brand-text mx-3"><
                        span>{sessionStorage.getItem("businessDisplayName")}</span>
                    </div>
                </a>
                <hr className="sidebar-divider my-0"/>
                <ul className="nav navbar-nav text-light" id="accordionSidebar">
                    <li className="nav-item" role="presentation">
                        <a className="nav-link active" href="/business/home">
                            <i className="fas fa-tachometer-alt"/>
                            <span>Dashboard</span></a>
                        <a className="nav-link active" href="/business/new/product">
                            <i className="fas fa-lightbulb"/><
                            span>New Product</span>
                        </a>
                        <a className="nav-link active" href="/business/orders">
                            <i className="fas fa-business-time"/>
                            <span>Orders</span>
                        </a>
                        <a className="nav-link active" href="/business/finance">
                            <i className="fas fa-dollar-sign"/>
                            <span>Finance</span>
                        </a>
                        <a className="nav-link active" href="/business/warehouse">
                            <i className="fas fa-warehouse"/>
                            <span>Warehouse</span>
                        </a>
                        <a className="nav-link active" href="/logout">
                            <i className="fas fa-sign-out-alt"/>
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};