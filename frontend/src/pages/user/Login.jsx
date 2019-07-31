import React from 'react';
import {Form, Icon, message, Spin} from 'antd';
import gql from "graphql-tag";
import {print} from 'graphql';
import logo from '../../assets/img/logo.png';
import Redirect from "react-router-dom/es/Redirect";
import {Helmet} from "react-helmet";
import axios from 'axios';
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import '../../assets/css/login.min.css';


const login_QUERY = gql`
    query login($email: String!,$password:String!,$cart_identifier:String,$image_URL:String,$loginMethod:String!,$fullname:String)
    {
        login(email:$email,password:$password, old_cart_id:$cart_identifier,image_URL:$image_URL,loginMethod:$loginMethod,fullname:$fullname) {
            userFullName
            userImage_URL
            token
            tokenExpiration
        }
    }
`;


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
        this.PersonalLoginSubmit = this.PersonalLoginSubmit.bind(this);
        this.SocialLogin = this.SocialLogin.bind(this);
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

    PersonalLoginSubmit = (event) => {
        event.preventDefault();
        this.setState({login_user: true});

        const {email, password} = this.state;
        const cart_identifier = sessionStorage.getItem("temporary_user_id");

        const variables = (cart_identifier) ? {
            email: email,
            password: password,
            cart_identifier: cart_identifier,
            loginMethod:"Regular"
        } : {
            email: email,
            password: password,
            loginMethod:"Regular"
        };


        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(login_QUERY),
            variables:variables
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                return false;
            }
            return res.data;
        }).then(resData => {
            const token = resData.data.login.token;
            const tokenExpiration = resData.data.login.tokenExpiration;
            const userFullName = resData.data.login.userFullName;
            const userImage_URL = resData.data.login.userImage_URL;

            sessionStorage.setItem("jwtToken", token);
            sessionStorage.setItem("jwtToken_expires", tokenExpiration);
            sessionStorage.setItem("regularUserFullName",userFullName);
            sessionStorage.setItem("regularUserImageURL",userImage_URL);
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
            console.log(error);
            this.setState({
                redirect: false,
                login_user: false
            });

        });
    };

    SocialLogin = (response, method) => {
        let email;
        let password=method;
        let image_URL;
        let fullname;

        if (method === "Google") {
            email = response.w3.U3;
            image_URL = response.profileObj.imageUrl;
            fullname = response.w3.ig;
        } else if (method === "Facebook") {
            email = response.email;
            image_URL = response.picture.data.url;
            fullname = response.name;
        }
        this.setState({login_user: true});
        const cart_identifier = sessionStorage.getItem("temporary_user_id");

        if (!email && !password) {
            return;
        }
        const variables = (cart_identifier) ? {
            email: email,
            password: password,
            cart_identifier: cart_identifier,
            image_URL:image_URL,
            loginMethod:method,
            fullname:fullname
        } : {
            email: email,
            password: password,
            image_URL:image_URL,
            loginMethod:method,
            fullname:fullname
        };

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(login_QUERY),
            variables: variables
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                return false;
            }
            return res.data;
        }).then(resData => {
            const token = resData.data.login.token;
            const tokenExpiration = resData.data.login.tokenExpiration;
            const userFullName = resData.data.login.userFullName;
            const userImage_URL = resData.data.login.userImage_URL;

            sessionStorage.setItem("jwtToken", token);
            sessionStorage.setItem("jwtToken_expires", tokenExpiration);
            sessionStorage.setItem("regularUserFullName",userFullName);
            sessionStorage.setItem("regularUserImageURL",userImage_URL);
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

    responseGoogle = (response) => {
        this.SocialLogin(response, "Google");
    };

    responseFacebook = (response) => {
        this.SocialLogin(response, "Facebook");
    };


    renderRedirect = () => {
        if (this.state.redirect === true) {
            const redirect_url = '/';
            return <Redirect to={redirect_url}/>
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
                <div className="login-box-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-6"
                                         style={{height: "40px", textAlign: "center", width: "250px"}}>
                                        <FacebookLogin
                                            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                                            fields="name,email,picture"
                                            buttonText="Log in with Facebook"
                                            callback={this.responseFacebook}
                                            cssClass="my-facebook-button-class"
                                            icon="fa-facebook"
                                        />
                                    </div>
                                    <div className="col-md-6"
                                         style={{height: "40px", textAlign: "center", width: "250px"}}>
                                        <GoogleLogin
                                            clientId={process.env.REACT_APP_GOOGLE_LOGIN_KEY}
                                            buttonText="Log in with Google"
                                            onSuccess={this.responseGoogle}
                                            onFailure={() => {
                                                message.error("Something went wrong with logging in with Google")
                                            }}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row align-items-center login-box-seperator-container">
                    < div className="login-box-seperator"/>
                    <div className="login-box-seperator-text">
                        <p style={{
                            marginBottom: "0px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            fontWeight: "400",
                            color: "rgb(201,201,201)"
                        }}> or </p>
                    </div>
                    <div className="login-box-seperator"/>
                </div>
                <div className="email-login" style={{backgroundColor: "#ffffff"}}>
                    <Form onSubmit={this.PersonalLoginSubmit} className="login-form">
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
                            <div className="invalid-feedback">{this.state.formErrors.password}</div>
                        </Form.Item>
                        <Form.Item>
                            <p>By logging in I agree to <a href="/tos">Terms of Service</a> and <a
                                href="privacy">Privacy
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
                        <p style={{marginBottom: "0px"}}> Don't have an account? <a id="register-link"
                                                                                    href="/signup">Sign up!</a>
                        </p>
                        <br/>
                        <p style={{marginBottom: "0px"}}> Forgot your password? <a id="register-link"
                                                                                   href="/reset/password">Reset it!</a>
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