import React from 'react';
import {Form, message, Spin, Icon} from 'antd';

import 'antd/es/message/style/css';
import 'antd/es/form/style/css';
import 'antd/es/spin/style/css';
import 'antd/es/icon/style/css';

import gql from "graphql-tag";
import {print} from 'graphql';
import logo from '../../assets/img/logo.svg';
import {Redirect} from 'react-router-dom';
import {Helmet} from "react-helmet";
import axios from 'axios';
import '../../assets/css/login.min.css';
import ReCAPTCHA from "react-google-recaptcha";
import AcceptsCookies from "../../components/cookieConsent";
import LazyLoad from "react-lazyload";


const recaptchaRef = React.createRef();


const resetPassword_MUTATION = gql`
    mutation resetPassword($email: String,$password:String,$mode:String!,$token:String)
    {
        resetPassword(email:$email,password:$password, mode:$mode,token:$token)
    }
`;

function passwordPreventCommon(password) {
    const commonPassword = Array("123456", "password", "12345678", "1234", "pussy", "12345", "dragon", "qwerty", "696969", "mustang", "letmein", "baseball", "master", "michael", "football", "shadow", "monkey", "abc123", "pass", "6969", "jordan", "harley", "ranger", "iwantu", "jennifer", "hunter", "2000", "test", "batman", "trustno1", "thomas", "tigger", "robert", "access", "love", "buster", "1234567", "soccer", "hockey", "killer", "george", "sexy", "andrew", "charlie", "superman", "asshole", "dallas", "jessica", "panties", "pepper", "1111", "austin", "william", "daniel", "golfer", "summer", "heather", "hammer", "yankees", "joshua", "maggie", "biteme", "enter", "ashley", "thunder", "cowboy", "silver", "richard", "orange", "merlin", "michelle", "corvette", "bigdog", "cheese", "matthew", "121212", "patrick", "martin", "freedom", "ginger", "blowjob", "nicole", "sparky", "yellow", "camaro", "secret", "dick", "falcon", "taylor", "111111", "131313", "123123", "bitch", "hello", "scooter", "please", "", "porsche", "guitar", "chelsea", "black", "diamond", "nascar", "jackson", "cameron", "654321", "computer", "amanda", "wizard", "xxxxxxxx", "money", "phoenix", "mickey", "bailey", "knight", "iceman", "tigers", "purple", "andrea", "horny", "dakota", "aaaaaa", "player", "sunshine", "morgan", "starwars", "boomer", "cowboys", "edward", "charles", "girls", "booboo", "coffee", "xxxxxx", "bulldog", "ncc1701", "rabbit", "peanut", "john", "johnny", "gandalf", "spanky", "winter", "brandy", "compaq", "carlos", "tennis", "james", "mike", "brandon", "fender", "anthony", "blowme", "ferrari", "cookie", "chicken", "maverick", "chicago", "joseph", "diablo", "sexsex", "hardcore", "666666", "willie", "welcome", "chris", "panther", "yamaha", "justin", "banana", "driver", "marine", "angels", "fishing", "david", "maddog", "hooters", "wilson", "butthead", "dennis", "captain", "bigdick", "chester", "smokey", "xavier", "steven", "viking", "snoopy", "blue", "eagles", "winner", "samantha", "house", "miller", "flower", "jack", "firebird", "butter", "united", "turtle", "steelers", "tiffany", "zxcvbn", "tomcat", "golf", "bond007", "bear", "tiger", "doctor", "gateway", "gators", "angel", "junior", "thx1138", "porno", "badboy", "debbie", "spider", "melissa", "booger", "1212", "flyers", "fish", "porn", "matrix", "teens", "scooby", "jason", "walter", "cumshot", "boston", "braves", "yankee", "lover", "barney", "victor", "tucker", "princess", "mercedes", "5150", "doggie", "zzzzzz", "gunner", "horney", "bubba", "2112", "fred", "johnson", "xxxxx", "tits", "member", "boobs", "donald", "bigdaddy", "bronco", "penis", "voyager", "rangers", "birdie", "trouble", "white", "topgun", "bigtits", "bitches", "green", "super", "qazwsx", "magic", "lakers", "rachel", "slayer", "scott", "2222", "asdf", "video", "london", "7777", "marlboro", "srinivas", "internet", "action", "carter", "jasper", "monster", "teresa", "jeremy", "11111111", "bill", "crystal", "peter", "pussies", "cock", "beer", "rocket", "theman", "oliver", "prince", "beach", "amateur", "7777777", "muffin", "redsox", "star", "testing", "shannon", "murphy", "frank", "hannah", "dave", "eagle1", "11111", "mother", "nathan", "raiders", "steve", "forever", "angela", "viper", "ou812", "jake", "lovers", "suckit", "gregory", "buddy", "whatever", "young", "nicholas", "lucky", "helpme", "jackie", "monica", "midnight", "college", "baby", "brian", "mark", "startrek", "sierra", "leather", "232323", "4444", "beavis", "bigcock", "happy", "sophie", "ladies", "naughty", "giants", "booty", "blonde", "golden", "0", "fire", "sandra", "pookie", "packers", "einstein", "dolphins", "0", "chevy", "winston", "warrior", "sammy", "slut", "8675309", "zxcvbnm", "nipples", "power", "victoria", "asdfgh", "vagina", "toyota", "travis", "hotdog", "paris", "rock", "xxxx", "extreme", "redskins", "erotic", "dirty", "ford", "freddy", "arsenal", "access14", "wolf", "nipple", "iloveyou", "alex", "florida", "eric", "legend", "movie", "success", "rosebud", "jaguar", "great", "cool", "cooper", "1313", "scorpio", "mountain", "madison", "987654", "brazil", "lauren", "japan", "naked", "squirt", "stars", "apple", "alexis", "aaaa", "bonnie", "peaches", "jasmine", "kevin", "matt", "qwertyui", "danielle", "beaver", "4321", "4128", "runner", "swimming", "dolphin", "gordon", "casper", "stupid", "shit", "saturn", "gemini", "apples", "august", "3333", "canada", "blazer", "cumming", "hunting", "kitty", "rainbow", "112233", "arthur", "cream", "calvin", "shaved", "surfer", "samson", "kelly", "paul", "mine", "king", "racing", "5555", "eagle", "hentai", "newyork", "little", "redwings", "smith", "sticky", "cocacola", "animal", "broncos", "private", "skippy", "marvin", "blondes", "enjoy", "girl", "apollo", "parker", "qwert", "time", "sydney", "women", "voodoo", "magnum", "juice", "abgrtyu", "777777", "dreams", "maxwell", "music", "rush2112", "russia", "scorpion", "rebecca", "tester", "mistress", "phantom", "billy", "6666", "albert");
    return commonPassword.includes(password);
}

const antIcon = <Icon type="loading" theme="twoTone" twoToneColor="#fffffff" style={{fontSize: 33}} spin/>;


class NormalResetForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            repassword: '',
            canSubmitEmail: false,
            canResetPassword: false,
            sending_reset_email: false,
            sending_reset_pw: false,
            resetToken: this.props.match.params.token,
            pwResetWasSuccess: false,
            redirect: false,
            formErrors: {email: '', password: '', repassword: ''},
            formValidity: {email: false, password: false, repassword: false}
        };
        this.handleChange = this.handleChange.bind(this);
        this.ResetPasswordSubmit = this.ResetPasswordSubmit.bind(this);
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

        const emailTest = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
        const passwordCommonTest = passwordPreventCommon(this.state.password);

        validity[name] = value.length > 0;
        let capitalizeFirstLetter = function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : (name === "repassword") ? 'Please enter your password conformation ' : `${name} is required and cannot be empty.`);
        if (validity[name]) {
            switch (name) {
                case "email": {
                    validity[name] = emailTest.test(value);
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Please enter a valid email address.`);
                    break;
                }
                case "password": {
                    validity[name] = passwordCommonTest;
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? 'Your password is to common.' : ``);

                    if (!validity[name]) {
                        validity[name] = value.length >= 12;
                        fieldValidationErrors[name] = capitalizeFirstLetter(!validity[name] ? 'Your password is to short.' : ``);
                    } else if (!validity[name]) {
                        validity[name] = value.toLowerCase().includes(this.state.fullname);
                        if (validity[name]) {
                            validity[name] = value.toLowerCase().includes(this.state.email);
                        }
                        fieldValidationErrors[name] = capitalizeFirstLetter(!validity[name] ? 'Your password should not contain your name or email.' : ``);
                    } else if (!validity[name]) {
                        const hasUpperCase = /[A-Z]/.test(value);
                        const hasLowerCase = /[a-z]/.test(value);
                        const hasNumbers = /\d/.test(value);
                        validity[name] = (hasUpperCase + hasLowerCase + hasNumbers === 3);

                        if (!validity[name]) {
                            if (!hasLowerCase) {
                                fieldValidationErrors[name] = 'Your password should contain a lower case letter'
                            }
                            if (!hasUpperCase) {
                                fieldValidationErrors[name] = 'Your password should contain a upper case letter'
                            }
                            if (!hasNumbers) {
                                fieldValidationErrors[name] = 'Your password should contain a number'
                            }
                        } else {
                            fieldValidationErrors[name] = ``;
                        }
                    }
                    break;
                }
                case "repassword": {
                    validity[name] = this.state.password === this.state.repassword;
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `The two passwords do not match.`);
                    break;
                }
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
        this.setState({
            canSubmitEmail: this.state.formValidity.email,
            canResetPassword: this.state.formValidity.password && this.state.formValidity.repassword
        });
    }

    ResetPasswordSubmit = (event) => {
        event.preventDefault();
        if (recaptchaRef.current.execute()) {

            let variables;
            if (this.state.email) {
                this.setState({sending_reset_email: true});
                variables = {
                    email: this.state.email,
                    mode: "sendEmail"
                }
            } else {
                this.setState({sending_reset_pw: true});
                variables = {
                    password: this.state.password,
                    mode: "resetPassword",
                    token: this.state.resetToken
                }
            }

            axios.post(process.env.REACT_APP_SERVER_URL, {
                query: print(resetPassword_MUTATION),
                variables: variables
            }).then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    return false;
                }
                return res.data;
            }).then(resData => {

                    const response = resData.data.resetPassword;

                    if (variables.mode === "sendEmail") {
                        this.setState({sending_reset_email: false});
                        message.success("We sent you the reset email")
                    } else if (variables.mode === "resetPassword")
                        if (response === true) {
                            message.success("Your password was reset");
                            this.setState({
                                redirect: true,
                                sending_reset_pw: false
                            });
                        } else {
                            message.warn("We experienced a problem in resetting your password. Try again")
                        }
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


            });
        }
        this.setState({
            redirect: false,
            sending_reset_email: false,
            sending_reset_pw: false,
        });
    };

    renderForm(resetToken) {
        if (resetToken) {
            return (
                <React.Fragment>
                    <Form onSubmit={this.ResetPasswordSubmit} className="login-form">
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
                            <label htmlFor="repassword">Confirm password</label>
                            <input
                                className={`form-control ${this.errorClass(this.state.formErrors.repassword)}`}
                                id="repassword"
                                name="repassword"
                                type="password"
                                placeholder="Confirm password"
                                value={this.state.repassword}
                                onChange={this.handleChange}
                            />
                            <div className="invalid-feedback">{this.state.formErrors.repassword}</div>
                        </Form.Item>
                        <Form.Item>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                size="invisible"
                                sitekey={process.env.REACT_APP_reCAPTCHA_KEY}
                            />
                        </Form.Item>
                        <br/>
                        <Form.Item>
                            <button className="btn btn-primary btn-block box-shadow"
                                    id="submit-id-submit"
                                    disabled={!this.state.canResetPassword}
                                    type="submit"
                                    style={{backgroundColor: "#1e96ff"}}>
                                {(this.state.sending_reset_email === true) ? <Spin indicator={antIcon}/> : ''}
                                {(this.state.sending_reset_email === true) ? '' : 'Reset my password'}
                            </button>
                        </Form.Item>
                    </Form>
                    <div id="login-box-footer"
                         style={{padding: "10px 20px", paddingBottom: "23px", paddingTop: "18px"}}>
                        <p style={{marginBottom: "0px"}}> Remembered your password? <a id="register-link"
                                                                                       href="/login">Log in!</a>
                        </p>
                    </div>
                </React.Fragment>
            );

        }
        return (
            <React.Fragment>
                <Form onSubmit={this.ResetPasswordSubmit} className="login-form">
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
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            size="invisible"
                            sitekey={process.env.REACT_APP_reCAPTCHA_KEY}
                        />
                    </Form.Item>
                    <br/>
                    <Form.Item>
                        <button className="btn btn-primary btn-block box-shadow"
                                id="submit-id-submit"
                                disabled={!this.state.canSubmitEmail}
                                type="submit"
                                style={{backgroundColor: "#1e96ff"}}>
                            {(this.state.sending_reset_email === true) ? <Spin indicator={antIcon}/> : ''}
                            {(this.state.sending_reset_email === true) ? '' : 'Reset my password'}
                        </button>
                    </Form.Item>
                </Form>
                <div id="login-box-footer"
                     style={{padding: "10px 20px", paddingBottom: "23px", paddingTop: "18px"}}>
                    <p style={{marginBottom: "0px"}}> Remembered your password? <a id="register-link"
                                                                                   href="/login">Log in!</a>
                    </p>
                </div>
            </React.Fragment>
        );
    }

    renderRedirect = () => {
        if (this.state.redirect === true) {
            const redirect_url = '/login';
            return <Redirect to={redirect_url}/>
        }
    };

    render() {
        const resetToken = this.state.resetToken;
        return (
            <div className="d-flex flex-column justify-content-center" id="login-box">
                <Helmet>
                    <title>Password reset</title>
                    <meta property="og:title" content="Reset"/>
                </Helmet>
                <div className="login-box-header">
                    <h4 style={{
                        color: "rgb(139,139,139)",
                        marginBottom: "0px",
                        fontWeight: "400",
                        fontSize: "27px"
                    }}>
                        <LazyLoad>
                            <img src={logo}
                                 style={{height: "150px"}}
                                 alt="RocketNow logo"/>
                        </LazyLoad>
                    </h4>
                </div>
                <div className="email-login" style={{backgroundColor: "#ffffff"}}>
                    {this.renderForm(resetToken)}
                    {this.renderRedirect()}
                    <AcceptsCookies/>
                    <br/>
                    <br/>
                    <br/>
                </div>
            </div>
        );

    }
}

export default Form.create()(NormalResetForm);