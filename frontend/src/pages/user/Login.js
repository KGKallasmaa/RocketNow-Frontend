import React from 'react';
import {Button, Form, Tabs} from 'antd';
import logo from "../../style/logo.png";
import {Link} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import Redirect from "react-router-dom/es/Redirect";
import {Helmet} from "react-helmet";


const TabPane = Tabs.TabPane;

const PageLogo = (props) => {
    return (
        <div className="logo">
            <a href="/"><img alt="Logo" src={logo} width="90" height="90" /></a>
        </div>
    )
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function loginButtonStatus(login_status) {
    return (login_status === true) ? '' : 'Log in ';
}

class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            businessemail: '',
            password: '',
            businesspassword: '',
            login_user: false,
            formErrors: { email: '', password: '', businessemail: '', businesspassword: '' },
            formValidity: { email: false, password: false, businessemail: false, businesspassword: false },
            canSubmit: false,
            canSubmitBusiness: false,
            regularrediret: false,
            businessredirect: false,
            isLogin: true,
            context: AuthContext
        };
        this.handleChange = this.handleChange.bind(this);
        this.PersonalLoginSubmit = this.PersonalLoginSubmit.bind(this);
        this.BusinessLoginSubmit = this.BusinessLoginSubmit.bind(this);
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        }, function () { this.validateField(name, value) })
    }

    validateField(name, value) {
        const fieldValidationErrors = this.state.formErrors;
        const validity = this.state.formValidity;
        const isEmail = name === "email";
        const isPassword = name === "password";

        const isBusinessEmail = name === "businessemail";
        const isBusinessPassword = name === "businesspassword";

        const emailTest = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;

        validity[name] = value.length > 0;
        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} is required and cannot be empty.`);

        if (validity[name]) {
            if (isEmail) {
                validity[name] = emailTest.test(value);
                fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} should be a valid email address`);
            }
            else if (isPassword) {
                validity[name] = value.length >= 1;
                fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} should be 1 character or more`);
            }
            if (isBusinessEmail) {
                validity[name] = emailTest.test(value);
                fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} should be a valid email address`);
            } else if (isBusinessPassword) {
                validity[name] = value.length >= 1;
                fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} should be 1 character or more`);
            }
        }

        this.setState({
            formErrors: fieldValidationErrors,
            formValidity: validity,
        }, () => this.canSubmit())
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'is-invalid');
    }

    canSubmit() {
        this.setState({canSubmit: this.state.formValidity.email && this.state.formValidity.password});
        this.setState({canSubmitBusiness:this.state.formValidity.businessemail && this.state.formValidity.businesspassword})
    }
    PersonalLoginSubmit = (event) => {
        event.preventDefault();
        this.setState({
            login_user: true
        });

        const { email, password } = this.state;
        const cart_identifier = sessionStorage.getItem("temporary_user_id");

        let requestBody = {
            query: `
               {
                login(email: "${email}", password: "${password}", old_cart_id: "${cart_identifier}") {
                  userId
                  token
                  tokenExpiration
                }
              }
            `
        };
        const base_url = 'http://localhost:3000/graphql';
        fetch(base_url, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const token = resData.data.login.token;
                const tokenExpiration = resData.data.login.tokenExpiration;

                sessionStorage.setItem("jwtToken", token);
                sessionStorage.setItem("jwtToken_expires", tokenExpiration);
                sessionStorage.removeItem("temporary_user_id");


                this.setState({
                    regularrediret: true
                });

            })
            .catch(err => {
                this.setState({
                    login_user: false
                });
            });
    };
    RenderRicrect = () =>{
        if (this.state.businessredirect === true){
            const { from } = this.props.location.state || { from: { pathname: '/business' } };
            return (<Redirect to={from.pathname} />) 
        }
        else if (this.state.regularrediret === true){
            const { from } = this.props.location.state || { from: { pathname: '/' } };
            return (<Redirect to={from.pathname} />) 
        }
    };

    BusinessLoginSubmit = (event) => {
        event.preventDefault();
        this.setState({
            login_user: true
        });

        const { businessemail, businesspassword } = this.state;

        let requestBody = {
            query: `
               {
                businessLogin(email: "${businessemail}", password: "${businesspassword}") {
                  token
                  tokenExpiration
                }
              }
            `
        };
        const base_url = 'http://localhost:3000/graphql';
        fetch(base_url, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const token = resData.data.businessLogin.token;
                const tokenExpiration = resData.data.businessLogin.tokenExpiration;

                sessionStorage.setItem("business_jwtToken", token);
                sessionStorage.setItem("jwtToken_expires", tokenExpiration);

                this.setState({
                    businessredirect: true
                });
            })
            .catch(err => {
                this.setState({
                    login_user: false
                });
            });
    };

    render() {
        const login_user_status = this.state.login_user;
        const keywords = ["login", "NoNoLine"];
        const cannonial_url = process.env.REACT_APP_CLIENT_URL + "/login";
        return (
            <div>
                <br /><br /><br /><br />
                {this.RenderRicrect()}
                <div className="container-fluid">
                    <Helmet>
                        <title>NoNoLine Login</title>
                        <meta name="description" content="Signing in to NoNoLine unlocks a whole new world." />
                        <meta property="og:title" content="NoNoLine Login" />
                        <meta name="keywords" content={keywords}/>
                        <link rel="canonial" href={cannonial_url}/>
                    </Helmet>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-3" />
                                <div className="col-md-6">
                                    <h1 className="text-center">Sign in</h1>
                                    <PageLogo />
                                    <Tabs defaultActiveKey="1">
                                        <TabPane tab="Personal" key="1">
                                            <Form onSubmit={this.PersonalLoginSubmit} className="login-form">
                                                <Form.Item>
                                                    <label htmlFor="email">Email address</label>
                                                    <input
                                                        className={`form-control ${this.errorClass(this.state.formErrors.email)}`}
                                                        id="email"
                                                        name="email"
                                                        type="text"
                                                        placeholder="Enter email"
                                                        value={this.state.email}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="invalid-feedback">{this.state.formErrors.email}</div>
                                                </Form.Item>
                                                <Form.Item>
                                                    <label htmlFor="password">Password</label>
                                                    <input
                                                        className={`form-control ${this.errorClass(this.state.formErrors.password)}`}
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        placeholder="Enter Password"
                                                        value={this.state.password}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="invalid-feedback">{this.state.formErrors.password}</div>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Link to="/reset">Forgot Password?</Link>
                                                    <br />
                                                    <Link to="/signup">Not a user? Sign up!</Link>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button disabled={!this.state.canSubmit} size="large" type="primary" loading={login_user_status} htmlType="submit" >
                                                        {loginButtonStatus(this.state.login_user)}
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </TabPane>
                                        <TabPane tab="Business" key="2">
                                            <Form onSubmit={this.BusinessLoginSubmit} className="login-form">
                                                <Form.Item>
                                                    <label htmlFor="email">Business email address</label>
                                                    <input
                                                        className={`form-control ${this.errorClass(this.state.formErrors.businessemail)}`}
                                                        id="businssemail"
                                                        name="businessemail"
                                                        type="text"
                                                        placeholder="Enter email"
                                                        value={this.state.businessemail}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="invalid-feedback">{this.state.formErrors.businessemail}</div>
                                                </Form.Item>
                                                <Form.Item>
                                                    <label htmlFor="password">Password</label>
                                                    <input
                                                        className={`form-control ${this.errorClass(this.state.formErrors.businesspassword)}`}
                                                        id="businesspassword"
                                                        name="businesspassword"
                                                        type="password"
                                                        placeholder="Enter Password"
                                                        value={this.state.businesspassword}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="invalid-feedback">{this.state.formErrors.businesspassword}</div>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Link to="/reset">Forgot Password?</Link>
                                                    <br />
                                                    <Link to="/signup">Not a user? Sign up!</Link>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button disabled={!this.state.canSubmitBusiness}
                                                        size="large"
                                                        type="primary"
                                                        loading={login_user_status}
                                                        htmlType="submit" >
                                                        {loginButtonStatus(this.state.login_user)}
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </TabPane>
                                    </Tabs>
                                </div>
                                <div className="col-md-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Form.create()(NormalLoginForm);