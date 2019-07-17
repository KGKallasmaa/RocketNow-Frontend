import React, {Component, Fragment} from 'react';
import {Badge, Drawer, Button, Menu, Icon} from 'antd';
import logo from '../../style/logo.png';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import SearchBox from "../../components/SearchBox";
import ShoppingCart from "../Cart";

const NUMBEROFGOODS_INCART_AND_SUBTOTAL_QUERY = gql`
    query numberOfGoodsInCartAndSubtotal($jwt_token: String!) {
        numberOfGoodsInCartAndSubtotal(jwt_token: $jwt_token)
    }
`;
const PageLogo = (props) => {
    return (
        <div className="logo">
            <a href="/"><img alt="Logo" src={logo} width="30" height="30"/></a>
        </div>
    )
};

function generate_temporary_userid(size) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


class RightMenu extends Component {
    constructor(props) {
        super(props);
        this.setState({
            visible: false
        });
        this.showShoppingCart = this.showShoppingCart.bind(this);
        this.shopppingcartElement = React.createRef();
    };

    showShoppingCart = () => {
        if (this.shopppingcartElement.current !== null) {
            this.shopppingcartElement.current.showDrawer();
        }
    };

    renderShoppingCartElement = () => {
        if (sessionStorage.getItem("business_jwtToken") === null) {
            return (<ShoppingCart ref={this.shopppingcartElement}/>);
        }
    };

    render() {
        const regular_token = sessionStorage.getItem("jwtToken");
        const business_token = sessionStorage.getItem("business_jwtToken");

        const login_or_logout_button_text = (regular_token == null && business_token == null) ? "Login" : "Logout";
        const login_or_logout_button_url = (regular_token == null && business_token == null) ? (process.env.REACT_APP_CLIENT_URL + "/login") : (process.env.REACT_APP_CLIENT_URL + "/logout");

        const jwt = sessionStorage.getItem("jwtToken");
        const temporary_user_id = (sessionStorage.getItem("temporary_user_id") !== null) ? sessionStorage.getItem("temporary_user_id") : generate_temporary_userid(256);
        if (sessionStorage.getItem("temporary_user_id")) sessionStorage.setItem("temporary_user_id", temporary_user_id);

        const jwt_token = (jwt !== null) ? jwt : temporary_user_id;

        return (
            <div>
                <Menu mode="horizontal">
                    <Menu.Item key="cart" onClick={this.showShoppingCart}>
                        <Fragment>
                            <Query query={NUMBEROFGOODS_INCART_AND_SUBTOTAL_QUERY} variables={{jwt_token}}>
                                {({data, loading, error}) => {
                                    if (loading) return (
                                        <Badge count={0} showZero title={"Shopping cart"}>
                                            <Icon type="shopping-cart"/>
                                        </Badge>
                                    );
                                    if (error) console.log(error);
                                    if (data) {
                                        const badge_count = data.numberOfGoodsInCartAndSubtotal[0];
                                        return (
                                            <Badge count={badge_count} showZero title={"Shopping cart"}>
                                                <Icon type="shopping-cart" style={{fontSize: '18px'}}/>
                                            </Badge>
                                        );
                                    }
                                }
                                }
                            </Query>
                        </Fragment>
                    </Menu.Item>
                    <Menu.Item key="auth">
                        <a href={login_or_logout_button_url}>{login_or_logout_button_text}</a>
                    </Menu.Item>
                </Menu>
                {this.renderShoppingCartElement()}
            </div>
        );
    }
}


export default class Navbar extends Component {
    state = {
        current: 'mail',
        visible: false
    }
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <nav className="menuBar">
                <PageLogo/>
                <div className="menuCon">
                    <div className="leftMenu">
                        <SearchBox query={this.props.query}/>
                    </div>
                    <div className="rightMenu">
                        <RightMenu/>
                    </div>
                    <Button className="barsMenu" type="primary" onClick={this.showDrawer}>
                        <span className="barsBtn"/>
                    </Button>
                    <Drawer
                        title="NoNoLine Menu"
                        placement="right"
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible}
                    >
                        <RightMenu/>
                    </Drawer>
                </div>
            </nav>
        );
    }
}