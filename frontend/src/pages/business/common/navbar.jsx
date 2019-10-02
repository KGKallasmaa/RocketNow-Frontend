import React from "react";

export default function BusinessNavbar() {
    const altMessage = sessionStorage.getItem("businessDisplayName") + " logo";
    return (
        <nav className="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
            <div className="container-fluid">
                <button className="btn btn-link d-md-none rounded-circle mr-3" id="sidebarToggleTop"
                        type="button">
                    <i className="fas fa-bars"/>
                </button>
                <ul className="nav navbar-nav flex-nowrap ml-auto">
                    <div className="d-none d-sm-block topbar-divider"/>
                    <li className="nav-item dropdown no-arrow" role="presentation">
                        <li className="nav-item dropdown no-arrow">
                            <a
                                className="dropdown-toggle nav-link" data-toggle="dropdown"
                                aria-expanded="false" href="#">
                                <span
                                    className="d-none d-lg-inline mr-2 text-gray-600 small">{sessionStorage.getItem("businessDisplayName")}
                                </span>
                                <img
                                    alt={altMessage}
                                    className="border rounded-circle img-profile"
                                    src={sessionStorage.getItem("logoURL")}/>
                            </a>
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
    );
};