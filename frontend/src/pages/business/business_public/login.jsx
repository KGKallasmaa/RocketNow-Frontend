import React from 'react';
import {Form, Icon, message, Spin} from 'antd';
import {print} from 'graphql';
import logo from '../../../assets/img/logo.svg';
import { Redirect } from 'react-router-dom';
import {Helmet} from "react-helmet";
import axios from 'axios';
import '../../../assets/css/login.min.css';
import {businessLogin_QUERY} from "../../../graphql/businessLogin_QUERY";


const antIcon = <Icon type="loading" theme="twoTone" twoToneColor="#fffffff" style={{fontSize: 33}} spin/>;


class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            canSubmit: false,
            login_user: false,
            formErrors: {email: '', password: ''},
            formValidity: {email: false, password: false}
        };
        this.handleChange = this.handleChange.bind(this);
        this.BusinessLoginSubmit = this.BusinessLoginSubmit.bind(this);
    }

    handleChange(event) {
        const {name, value} = event.target;

        this.setState({
            [name]: value
        }, function () {
            this.validateField(name, value)
        })
    }

    validateField(name, value) {
        const fieldValidationErrors = this.state.formErrors;
        const validity = this.state.formValidity;

        validity[name] = value.length > 0;
        let capitalizeFirstLetter = function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} is required and cannot be empty.`);

        this.setState({
            formErrors: fieldValidationErrors,
            formValidity: validity,
        }, () => this.canSubmit())
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'is-invalid');
    }

    canSubmit() {
        this.setState({
            canSubmit:
                this.state.formValidity.email &&
                this.state.formValidity.password &&
                this.state.login_user === false
        });
    }

    BusinessLoginSubmit = (event) => {
        event.preventDefault();
        this.setState({login_user: true});

        const {email, password} = this.state;

        const variables = {
            email: email,
            password: password,
        };


        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(businessLogin_QUERY),
            variables: variables
        }).then(resData => {
                const base = resData.data.data.businessLogin;
                sessionStorage.setItem("jwtToken_business", base.token);
                sessionStorage.setItem("jwtToken_expires_business", base.tokenExpiration);
                sessionStorage.setItem("businessDisplayName", base.businessDisplayName);
                sessionStorage.setItem("businessLegalName", base.businessLegalName);
                sessionStorage.setItem("logoURL", base.logoURL);
                sessionStorage.removeItem("jwtToken");
                sessionStorage.removeItem("jwtToken_expires");
                sessionStorage.removeItem("temporary_user_id");
                this.setState({
                    redirect: true,
                    login_user: false
                });
                return true;
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
            this.setState({
                redirect: false,
                login_user: false
            });

        });
    };

    renderRedirect = () => {
        const{redirect,from} = this.state;
        if (redirect === true) {
            let redirectUrl ="/business/home";
            if (from){
                redirectUrl = "/"+from;
            }
            return <Redirect to={redirectUrl}/>
        }
    };

    render() {
        const login_user_status = this.state.login_user;
        const cannonial_url = process.env.REACT_APP_PUBLIC_URL + "/login";
        return (
            <div className="d-flex flex-column justify-content-center" id="login-box">
                <Helmet>
                    <title>Login</title>
                    <meta property="og:title" content="Login"/>
                    <link rel="canonial" href={cannonial_url}/>
                    <meta property="og:description"
                          content="Loging in to RocketNow unlocks a whole new world"/>
                    <meta name="description" content="Signing up to RocketNow unlocks a whole new world"/>
                </Helmet>
                <div className="login-box-header">
                    <h4 style={{
                        color: "rgb(139,139,139)",
                        marginBottom: "0px",
                        fontWeight: "400",
                        fontSize: "27px"
                    }}>
                        <img src={logo}
                             style={{height: "150px"}}
                             alt="RocketNow logo"/>
                    </h4>
                </div>
                <div className="email-login" style={{backgroundColor: "#ffffff"}}>
                    <Form onSubmit={this.BusinessLoginSubmit} className="login-form">
                        <Form.Item>
                            <label htmlFor="email">Email</label>
                            <input
                                className={`form-control ${this.errorClass(this.state.formErrors.email)}`}
                                id="email"
                                name="email"
                                type="text"
                                placeholder="Email"
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
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                            <span>Forgot your password? <a href="/reset/password">Reset it!</a></span>
                            <div className="invalid-feedback">{this.state.formErrors.password}</div>
                        </Form.Item>
                        <Form.Item>
                            <p>By logging in I agree to <a href="/tos">Terms of Service</a> and <a
                                href="/privacy">Privacy
                                Policy</a>
                            </p>
                        </Form.Item>
                        <Form.Item>
                            <button className="btn btn-primary btn-block box-shadow"
                                    id="submit-id-submit"
                                    disabled={!this.state.canSubmit}
                                    type="submit"
                                    style={{backgroundColor: "#1e96ff"}}>
                                {(login_user_status === true) ? <Spin indicator={antIcon}/> : ''}
                                {(login_user_status === true) ? '' : 'Log in'}
                            </button>
                        </Form.Item>
                    </Form>
                    {this.renderRedirect()}
                    <div id="login-box-footer"
                         style={{padding: "10px 20px", paddingBottom: "23px", paddingTop: "18px"}}>
                        <p style={{marginBottom: "0px"}}> Don't have a business account? <a id="register-link"
                                                                                            href="/business/signup">Sign
                            up!</a>
                        </p>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
            </div>
        );
    }
}

export default Form.create()(NormalLoginForm);