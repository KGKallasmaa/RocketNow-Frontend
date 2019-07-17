import {Icon, Layout, Menu} from 'antd';
import React from "react";
import {Link} from "react-router-dom";


import DashBoard from "./Dashboard";
import Customers from "./Customers";
import Finance from "./Finance";
import Orders from "./Orders";
import Warehouse from "./Warehouse";
import Settings from "./Settings";

import NewPhysicalGood from "./new_goods/PhysicalGood";


const {Header, Content, Sider} = Layout;
const SubMenu = Menu.SubMenu;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            key: "1",
        }

    }

    handleClick = (e) => {
        this.setState({
            key: e.key,
        });

    };

    menu_bar() {
        return (
            <div>
                <div className="logo"/>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline"
                      onClick={this.handleClick}>
                    <Menu.Item key="1">
                        <Icon type="dashboard"/>
                        <span>Dashboard</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="dollar"/>
                        <span>Finance</span>
                    </Menu.Item>
                    <SubMenu title={<span><Icon type="barcode"/><span>Warehouse</span></span>}>
                        <Menu.Item key="3.1"><Icon type="tags"/><span>New physical good</span></Menu.Item>
                        <Menu.Item key="3.2"><Icon type="cloud"/><span>New digital good</span></Menu.Item>
                        <Menu.Item key="3.3"><Icon type="sync"/><span>New subscription</span></Menu.Item>
                        <Menu.Item key="3">Warehouse</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="4">
                        <Icon type="shopping"/>
                        <span>Unfilled orders</span>
                    </Menu.Item>
                    <Menu.Item key="5">
                        <Icon type="user-add"/>
                        <span>Customers</span>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <Icon type="setting"/>
                        <span>Settings</span>
                    </Menu.Item>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <Menu.Item key="7">
                        <Icon type="logout"/>
                        <span>Logout</span>
                        <Link to="/logout">Logout</Link>
                    </Menu.Item>
                </Menu>
            </div>
        );
    };


    onCollapse = (collapsed) => {
        this.setState({collapsed});
    };
    showBusinessElement = () => {
        switch (this.state.key) {
            case "1":
                return (<div><DashBoard/></div>);
            case "2":
                return (<div><Finance/></div>);
            case "3":
                return (<div><Warehouse/></div>);
            case "3.1":
                return (<div><NewPhysicalGood/></div>);
            case "4":
                return (
                    <div>
                        <Orders/>
                    </div>);
            case "5":
                return (
                    <div>
                        <Customers/>
                    </div>);
            case "6":
                return (
                    <div>
                        <Settings/>
                    </div>);
        }
    };

    render() {
        const business_element = this.showBusinessElement();
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    {this.menu_bar()}
                </Sider>
                <Layout>
                    <Content style={{margin: '0 16px'}}>
                        <div style={{padding: 24, background: '#fff', minHeight: 360}} key="1">
                            {business_element}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}