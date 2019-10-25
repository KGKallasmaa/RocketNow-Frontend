import React from 'react';
import {message} from 'antd';
import gql from "graphql-tag";
import {print} from 'graphql';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import '../../assets/css/login.min.css';
import Footer from "../../components/footer";

import '../../assets/css/verification.min.css';
import logo from '../../assets/img/logo.svg';


const verifyEmail_MUTATION = gql`
    mutation createUser($token: String!) {
        verifyEmail(token:$token)
        {
            userFullName
            userImage_URL
            token
            tokenExpiration
        }
    }
`;


export default class Verify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verificationToken: this.props.match.params.token,
            isSuccesfulyVerified: false,
            redirect: false,
        };
        this.verifyEmail = this.verifyEmail.bind(this);

    }

    async verifyEmail(token) {
        if (!token) {
            return;
        }

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(verifyEmail_MUTATION),
            variables: {
                token: token.toString(),
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                return false;
            }
            return res.data;
        }).then(resData => {
                message.success('Your email was successfully verified!');
                sessionStorage.setItem("jwtToken", resData.data.verifyEmail.token);
                sessionStorage.setItem("jwtToken_expires", resData.data.verifyEmail.tokenExpiration);
                sessionStorage.setItem("regularUserFullName", resData.data.verifyEmail.userFullName);
                sessionStorage.setItem("regularUserImageURL", resData.data.verifyEmail.userImage_URL);
                sessionStorage.removeItem("temporary_user_id");
                this.setState({redirect: true});
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
            return false;
        });
    };

    rendeText() {
        if (sessionStorage.getItem("jwtToken")) {
            return (
                <div>
                    <h1 className="text-center" style={{fontSize: "20px"}}>Your email has been verified</h1>
                </div>
            );
        } else if (!this.props.match.params.token) {
            return (
                <div>
                    <h1 className="text-center" style={{fontSize: "25px", color: "#1F96FE"}}>Thank you for joining</h1>
                    <h6 style={{fontSize: "15px"}}>We sent you a conformation email</h6>
                </div>
            );
        } else {
            return (<div/>);
        }
    }

    renderButton() {
        const urlToShare = process.env.REACT_APP_PUBLIC_URL + "/signup";
        const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" + urlToShare;
        const twitterUrl = "https://twitter.com/share?url=" + urlToShare + "&amp;text=Just%20joined%20RocketNow🚀&amp;hashtags=rocketnow";
        const emailUrl = "mailto:?Subject=Join RocketNow🚀 &amp;Body=I%20just%20joined%20RocketNow%20and%20I%20thought%20you%20should%20too!%20" + urlToShare;

        if (!this.props.match.params.token) {
            return (
                <div className="col">
                    <ul className="list-inline text-center">
                        <li className="list-inline-item">
                            <a href={facebookUrl} target="_blank">
                            <span
                                className="fa-stack fa-lg"><i
                                className="fa fa-circle fa-stack-2x"/><i
                                className="fa fa-facebook fa-stack-1x fa-inverse"/>
                        </span>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href={twitterUrl} target="_blank">
                            <span
                                className="fa-stack fa-lg"><i
                                className="fa fa-circle fa-stack-2x"/><i
                                className="fa fa-twitter fa-stack-1x fa-inverse"/>
                            </span>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href={emailUrl} target="_blank">
                            <span
                                className="fa-stack fa-lg"><i
                                className="fa fa-circle fa-stack-2x"/><i
                                className="fa fa-share-alt fa-stack-1x fa-inverse"/>
                            </span>
                            </a>
                        </li>
                    </ul>
                </div>
            );
        } else if (sessionStorage.getItem("jwtToken")) {
            return (
                <a href="/"
                   className="btn btn-lg btn-primary active"
                   style={{
                       backgroundColor: "#1f96fe",
                       width: "450px",
                       padding: "15px"
                   }}
                >
                    Go to homepage
                </a>
            );
        } else {
            return (<div/>);
        }
    }

    componentDidMount() {
        this.verifyEmail(this.props.match.params.token);
    }

    renderRedirect = () => {
        if (this.state.redirect === true) {
            const redirect_url = '/';
            return <Redirect to={redirect_url}/>
        }
    };

    render() {
        const button = this.renderButton();
        const text = this.rendeText();
        return (
            <div>
                {this.renderRedirect()}
                <Helmet>
                    <title>Email verification</title>
                </Helmet>
                <div className="login-clean">
                    <form method="post" style={{width: "450px", padding: "35px"}}>
                        <div className="illustration">
                            <img src={logo} style={{width: "150px"}} alt="RocketNow logo"/>
                        </div>
                        {text}
                        <div className="form-group">
                            <div className="container">
                                <div className="form-row">
                                    {button}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <Footer/>
            </div>
        );
    }
}