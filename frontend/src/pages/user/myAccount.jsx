import React from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../../components/footer.jsx';
import {Navbar} from '../../components/navbar.jsx';
//import {message} from 'antd';
//import {formatTimeStamp} from '../../components/relativeTimestamp';
//import '../../assets/css/myaccount.min.css';
//import {LazyLoadImage} from 'react-lazy-load-image-component';
//import {getEmoji} from '../../components/emoji';
//import {UserCard_QUERY} from '../../graphql/userCard_QUERY';
//import {OrderCard_QUERY} from '../../graphql/orderCard_QUERY';
//import {Address_QUERY} from '../../graphql/address_QUERY';
//import axios from "axios";
//import {print} from "graphql";

import {Icon, Tabs} from 'antd';
import {UserPastOrdersTab} from "./components/userPastOrdersTab";
import {UserGeneralTab} from "./components/userGeneralTab";
import {UserSubscriptionsTab} from "./components/userSubscriptionsTab";
import {UserSettingsTab} from "./components/userSettingsTab";


const {TabPane} = Tabs;


export default class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        const {individualUser, userDeliveryAdresses, orders} = this.state;
        const userName = sessionStorage.getItem("regularUserFullName");
        return (
            <React.Fragment>
                <Helmet>
                    <title>My account</title>
                    <meta property="og:title" content="My account"/>
                    <meta property="og:description" content="View your personal story at Rocketnow"/>
                    <meta name="description" content="View your personal story at RocketNow"/>
                </Helmet>
                <Navbar/>
                <br/><br/><br/><br/><br/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <h3 className="text-center">
                                Hello, <b>{userName}</b>
                            </h3>
                        </div>
                    </div>
                </div>
                <br/>
                <br/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-1"/>
                        <div className="col-md-10">
                            <Tabs defaultActiveKey="1">
                                <TabPane
                                    tab={<span><Icon type="user"/>General</span>}
                                    key="1">
                                    <UserGeneralTab/>
                                </TabPane>
                                <TabPane
                                    tab={<span><Icon type="tags"/>Orders</span>}
                                    key="2">
                                    <UserPastOrdersTab/>
                                </TabPane>
                                <TabPane
                                    tab={<span><Icon type="schedule"/>Subscriptions</span>}
                                    key="3">
                                    <UserSubscriptionsTab/>
                                </TabPane>
                                <TabPane
                                    tab={<span><Icon type="setting"/>Settings</span>}
                                    key="4">
                                    <UserSettingsTab/>
                                </TabPane>
                            </Tabs>
                        </div>
                        <div className="col-md-1"/>

                    </div>
                </div>
                <br/><br/><br/><br/><br/>
                <br/><br/><br/><br/><br/>
                < br/> < br/>
                < Footer/>
            </React.Fragment>
        );
    }
};