import React from 'react';
import {Form, message, Spin, Icon} from 'antd';
import gql from "graphql-tag";
import {print} from 'graphql';
import logo from '../../assets/img/logo.svg';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import '../../assets/css/login.min.css';
import AcceptsCookies from "../../components/legal/cookie_consent";


const signUp_MUTATION = gql`
    mutation createUser($fullname: String!,$email:String!,$password:String,$signupMethod:String!,$image_URL:String) {
        createUser(userInput:{fullname:$fullname,email: $email, password:$password,signupMethod:$signupMethod,image_URL:$image_URL})
    }
`;
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

function passwordPreventCommon(password) {
    const commonPassword = Array("123456", "password", "12345678", "1234", "pussy", "12345", "dragon", "qwerty", "696969", "mustang", "letmein", "baseball", "master", "michael", "football", "shadow", "monkey", "abc123", "pass", "6969", "jordan", "harley", "ranger", "iwantu", "jennifer", "hunter", "2000", "test", "batman", "trustno1", "thomas", "tigger", "robert", "access", "love", "buster", "1234567", "soccer", "hockey", "killer", "george", "sexy", "andrew", "charlie", "superman", "asshole", "dallas", "jessica", "panties", "pepper", "1111", "austin", "william", "daniel", "golfer", "summer", "heather", "hammer", "yankees", "joshua", "maggie", "biteme", "enter", "ashley", "thunder", "cowboy", "silver", "richard", "orange", "merlin", "michelle", "corvette", "bigdog", "cheese", "matthew", "121212", "patrick", "martin", "freedom", "ginger", "blowjob", "nicole", "sparky", "yellow", "camaro", "secret", "dick", "falcon", "taylor", "111111", "131313", "123123", "bitch", "hello", "scooter", "please", "", "porsche", "guitar", "chelsea", "black", "diamond", "nascar", "jackson", "cameron", "654321", "computer", "amanda", "wizard", "xxxxxxxx", "money", "phoenix", "mickey", "bailey", "knight", "iceman", "tigers", "purple", "andrea", "horny", "dakota", "aaaaaa", "player", "sunshine", "morgan", "starwars", "boomer", "cowboys", "edward", "charles", "girls", "booboo", "coffee", "xxxxxx", "bulldog", "ncc1701", "rabbit", "peanut", "john", "johnny", "gandalf", "spanky", "winter", "brandy", "compaq", "carlos", "tennis", "james", "mike", "brandon", "fender", "anthony", "blowme", "ferrari", "cookie", "chicken", "maverick", "chicago", "joseph", "diablo", "sexsex", "hardcore", "666666", "willie", "welcome", "chris", "panther", "yamaha", "justin", "banana", "driver", "marine", "angels", "fishing", "david", "maddog", "hooters", "wilson", "butthead", "dennis", "captain", "bigdick", "chester", "smokey", "xavier", "steven", "viking", "snoopy", "blue", "eagles", "winner", "samantha", "house", "miller", "flower", "jack", "firebird", "butter", "united", "turtle", "steelers", "tiffany", "zxcvbn", "tomcat", "golf", "bond007", "bear", "tiger", "doctor", "gateway", "gators", "angel", "junior", "thx1138", "porno", "badboy", "debbie", "spider", "melissa", "booger", "1212", "flyers", "fish", "porn", "matrix", "teens", "scooby", "jason", "walter", "cumshot", "boston", "braves", "yankee", "lover", "barney", "victor", "tucker", "princess", "mercedes", "5150", "doggie", "zzzzzz", "gunner", "horney", "bubba", "2112", "fred", "johnson", "xxxxx", "tits", "member", "boobs", "donald", "bigdaddy", "bronco", "penis", "voyager", "rangers", "birdie", "trouble", "white", "topgun", "bigtits", "bitches", "green", "super", "qazwsx", "magic", "lakers", "rachel", "slayer", "scott", "2222", "asdf", "video", "london", "7777", "marlboro", "srinivas", "internet", "action", "carter", "jasper", "monster", "teresa", "jeremy", "11111111", "bill", "crystal", "peter", "pussies", "cock", "beer", "rocket", "theman", "oliver", "prince", "beach", "amateur", "7777777", "muffin", "redsox", "star", "testing", "shannon", "murphy", "frank", "hannah", "dave", "eagle1", "11111", "mother", "nathan", "raiders", "steve", "forever", "angela", "viper", "ou812", "jake", "lovers", "suckit", "gregory", "buddy", "whatever", "young", "nicholas", "lucky", "helpme", "jackie", "monica", "midnight", "college", "baby", "brian", "mark", "startrek", "sierra", "leather", "232323", "4444", "beavis", "bigcock", "happy", "sophie", "ladies", "naughty", "giants", "booty", "blonde", "golden", "0", "fire", "sandra", "pookie", "packers", "einstein", "dolphins", "0", "chevy", "winston", "warrior", "sammy", "slut", "8675309", "zxcvbnm", "nipples", "power", "victoria", "asdfgh", "vagina", "toyota", "travis", "hotdog", "paris", "rock", "xxxx", "extreme", "redskins", "erotic", "dirty", "ford", "freddy", "arsenal", "access14", "wolf", "nipple", "iloveyou", "alex", "florida", "eric", "legend", "movie", "success", "rosebud", "jaguar", "great", "cool", "cooper", "1313", "scorpio", "mountain", "madison", "987654", "brazil", "lauren", "japan", "naked", "squirt", "stars", "apple", "alexis", "aaaa", "bonnie", "peaches", "jasmine", "kevin", "matt", "qwertyui", "danielle", "beaver", "4321", "4128", "runner", "swimming", "dolphin", "gordon", "casper", "stupid", "shit", "saturn", "gemini", "apples", "august", "3333", "canada", "blazer", "cumming", "hunting", "kitty", "rainbow", "112233", "arthur", "cream", "calvin", "shaved", "surfer", "samson", "kelly", "paul", "mine", "king", "racing", "5555", "eagle", "hentai", "newyork", "little", "redwings", "smith", "sticky", "cocacola", "animal", "broncos", "private", "skippy", "marvin", "blondes", "enjoy", "girl", "apollo", "parker", "qwert", "time", "sydney", "women", "voodoo", "magnum", "juice", "abgrtyu", "777777", "dreams", "maxwell", "music", "rush2112", "russia", "scorpion", "rebecca", "tester", "mistress", "phantom", "billy", "6666", "albert");
    return commonPassword.includes(password);
}


function socialLogin(email, image_URL, method, fullname) {
    const cart_identifier = sessionStorage.getItem("temporary_user_id");

    const variables = (cart_identifier) ? {
        email: email,
        password: method,
        image_URL: image_URL,
        cart_identifier: cart_identifier,
        loginMethod: method,
        fullname: fullname
    } : {
        email: email,
        password: method,
        image_URL: image_URL,
        loginMethod: method,
        fullname: fullname
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
            sessionStorage.setItem("regularUserFullName", userFullName);
            sessionStorage.setItem("regularUserImageURL", userImage_URL);
            sessionStorage.removeItem("temporary_user_id");
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

class NormalSignupForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            fullname: '',
            password: '',
            repassword: '',
            signupBusinessUser: false,
            redirectURL: '/verify/email',
            formErrors: {email: '', password: '', fullname: '', repassword: ''},
            formValidity: {email: false, password: false, fullname: false, repassword: false},
            canSubmit: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.businessSignupSubmit = this.PersonalSignupSubmit.bind(this);
        this.SocialSignUp = this.SocialSignUp.bind(this);
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
        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} is required and cannot be empty.`);
        if (validity[name]) {
            switch (name) {
                case "fullname": {
                    //TODO: full name regex
                    validity[name] = this.state.fullname.length >= 6;
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} should be a valid name.`);
                    break;
                }
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
            canSubmit:
                this.state.formValidity.fullname &&
                this.state.formValidity.repassword &&
                this.state.formValidity.email &&
                this.state.formValidity.password
        });
    }

    PersonalSignupSubmit = (event) => {
        event.preventDefault();
        this.setState({signupBusinessUser: true});

        const {email, password, fullname} = this.state;

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(signUp_MUTATION),
            variables: {
                fullname: fullname,
                email: email,
                password: password,
                signupMethod: "Regular",
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                this.setState({
                    signupBusinessUser: false,
                    redirect: false
                });
                return res.data;
            }
            return null;
        }).then(resData => {
                message.success('You successfully signed up!');
                this.setState({
                    redirect: true,
                    signupBusinessUser: false
                });
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
                signupBusinessUser: false
            });

        });
    };

    SocialSignUp = (response, method) => {
        let fullname;
        let email;
        let image_URL;

        if (method === "Google") {
            fullname = response.w3.ig;
            email = response.w3.U3;
            image_URL = response.profileObj.imageUrl;
        } else if (method === "Facebook") {
            fullname = response.name;
            email = response.email;
            image_URL = response.picture.data.url;
        }
        if (fullname && email && image_URL) {
            axios.post(process.env.REACT_APP_SERVER_URL, {
                query: print(signUp_MUTATION),
                variables: {
                    fullname: fullname,
                    email: email,
                    image_URL: image_URL,
                    signupMethod: method,
                }
            }).then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    message.error('There was a problem setting up your new account with ' + method + ".");
                    this.setState({
                        signupBusinessUser: false,
                        redirect: false
                    });
                    throw new Error('Failed to signup user with ' + method);
                }
                return res.data;
            }).then(resData => {
                    this.setState({
                        redirect: false
                    });
                    //Log users in
                    socialLogin(email, image_URL, method, fullname);

                    this.setState({
                        signupBusinessUser: false,
                        redirect: true,
                        redirectURL: "/"
                    });
                }
            );
        }
    };

    responseGoogle = (response) => {
        this.SocialSignUp(response, "Google");
    };

    responseFacebook = (response) => {
        this.SocialSignUp(response, "Facebook");
    };


    renderRedirect = () => {
        if (this.state.redirect === true) {
            const redirect_url = this.state.redirectURL;
            return <Redirect to={redirect_url}/>
        }
    };

    render() {
        const signup_user_status = this.state.signupBusinessUser;
        const cannonial_url = process.env.REACT_APP_PUBLIC_URL + "/signup";
        return (
            <div className="d-flex flex-column justify-content-center" id="login-box">
                <Helmet>
                    <title>Sign up</title>
                    <meta property="og:title" content="Sign up"/>
                    <link rel="canonial" href={cannonial_url}/>
                    <meta property="og:description"
                          content="Signing up to RocketNow unlocks a whole new world"/>
                    <meta name="description" content="Signing up to RocketNow unlocks a whole new world"/>
                </Helmet>
                <AcceptsCookies/>
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
                                            buttonText="Sign up with Facebook"
                                            callback={this.responseFacebook}
                                            cssClass="my-facebook-button-class"
                                            icon="fa-facebook"
                                        />
                                    </div>
                                    <div className="col-md-6"
                                         style={{height: "40px", textAlign: "center", width: "250px"}}>
                                        <GoogleLogin
                                            clientId={process.env.REACT_APP_GOOGLE_LOGIN_KEY}
                                            buttonText="Sign up with Google"
                                            onSuccess={this.responseGoogle}
                                            onFailure={() => {
                                                message.error("Something went wrong with signing in with Google")
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
                    <Form onSubmit={this.PersonalSignupSubmit} className="login-form">
                        <Form.Item>
                            <label htmlFor="name">Your name</label>
                            <input
                                className={`form-control ${this.errorClass(this.state.formErrors.fullname)}`}
                                id="fullname"
                                name="fullname"
                                type="text"
                                placeholder="Your name"
                                value={this.state.fullname}
                                onChange={this.handleChange}
                            />
                            <div className="invalid-feedback">{this.state.formErrors.fullname}</div>
                        </Form.Item>
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
                            <p>By signing up I agree to <a href="/tos">Terms of Service</a> and <a
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
                                {(signup_user_status === true) ? <Spin indicator={antIcon}/> : ''}
                                {(signup_user_status === true) ? '' : 'Sign up'}
                            </button>
                        </Form.Item>
                    </Form>
                    {this.renderRedirect()}
                    <div id="login-box-footer"
                         style={{padding: "10px 20px", paddingBottom: "23px", paddingTop: "18px"}}>
                        <p style={{marginBottom: "0px"}}> Already have an account? <a id="register-link"
                                                                                      href="/login">Login!</a>
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

export default Form.create()(NormalSignupForm);