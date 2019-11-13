import React from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../../components/footer.jsx';
import {Navbar} from '../../components/navbar.jsx';
import '../../assets/css/myaccount.min.css';
import {Icon, Tabs} from 'antd';
import {UserPastOrdersTab} from "./components/userPastOrdersTab";
import {UserGeneralTab} from "./components/userGeneralTab";
import {UserSubscriptionsTab} from "./components/userSubscriptionsTab";
import {UserSettingsTab} from "./components/userSettingsTab";
import {fetchData} from "../../components/fetcher";
import {OrderCard_QUERY} from "./graphql/orderCard_QUERY";
import AcceptsCookies from "../../components/legal/cookie_consent";


const {TabPane} = Tabs;

export default class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const variables = {
            jwt_token: sessionStorage.getItem("jwtToken")
        };
        let fetchPastOrderData = fetchData(variables, OrderCard_QUERY);
        let orderData = await fetchPastOrderData;
        if (orderData !== null) {
            this.setState({
                orders: orderData.individualOrder,
            });
        }
    }


    render() {
        let {orders} = this.state;
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
                <AcceptsCookies/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-1"/>
                        <div className="col-md-10">
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={<span><Icon type="user"/>General</span>} key="1">
                                    {(orders === undefined) ? <p>Loading ...</p> :
                                        <UserGeneralTab userName={userName} orders={orders}/>}
                                </TabPane>
                                <TabPane tab={<span><Icon type="tags"/>Orders</span>} key="2">
                                    {(orders === undefined) ? <p>Loading ...</p> :
                                        <UserPastOrdersTab orders={orders}/>
                                    }
                                </TabPane>
                                <TabPane tab={<span><Icon type="schedule"/>Subscriptions</span>} key="3">
                                    <UserSubscriptionsTab/>
                                </TabPane>
                                <TabPane tab={<span><Icon type="setting"/>Settings</span>} key="4">
                                    <UserSettingsTab/>
                                </TabPane>
                            </Tabs>
                        </div>
                        <div className="col-md-1"/>
                    </div>
                </div>
                <br/><br/><br/><br/><br/>
                <br/><br/><br/><br/><br/>
                <br/> <br/>
                <Footer/>
            </React.Fragment>
        );
    }
};