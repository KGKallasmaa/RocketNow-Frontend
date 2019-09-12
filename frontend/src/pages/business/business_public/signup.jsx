import React from 'react';
import {Form, message, Spin, Icon} from 'antd';
import {print} from 'graphql';
import logo from '../../../assets/img/logo.svg';
import Redirect from "react-router-dom/es/Redirect";
import {Helmet} from "react-helmet";
import axios from 'axios';
import '../../../assets/css/login.min.css';
import {businessSignUp_MUTATION} from "../../../graphql/businessSignup_MUTATION";



const antIcon = <Icon type="loading" theme="twoTone" twoToneColor="#fffffff" style={{fontSize: 33}} spin/>;

function passwordPreventCommon(password) {
    const commonPassword = Array("123456", "password", "12345678", "1234", "pussy", "12345", "dragon", "qwerty", "696969", "mustang", "letmein", "baseball", "master", "michael", "football", "shadow", "monkey", "abc123", "pass", "6969", "jordan", "harley", "ranger", "iwantu", "jennifer", "hunter", "2000", "test", "batman", "trustno1", "thomas", "tigger", "robert", "access", "love", "buster", "1234567", "soccer", "hockey", "killer", "george", "sexy", "andrew", "charlie", "superman", "asshole", "dallas", "jessica", "panties", "pepper", "1111", "austin", "william", "daniel", "golfer", "summer", "heather", "hammer", "yankees", "joshua", "maggie", "biteme", "enter", "ashley", "thunder", "cowboy", "silver", "richard", "orange", "merlin", "michelle", "corvette", "bigdog", "cheese", "matthew", "121212", "patrick", "martin", "freedom", "ginger", "blowjob", "nicole", "sparky", "yellow", "camaro", "secret", "dick", "falcon", "taylor", "111111", "131313", "123123", "bitch", "hello", "scooter", "please", "", "porsche", "guitar", "chelsea", "black", "diamond", "nascar", "jackson", "cameron", "654321", "computer", "amanda", "wizard", "xxxxxxxx", "money", "phoenix", "mickey", "bailey", "knight", "iceman", "tigers", "purple", "andrea", "horny", "dakota", "aaaaaa", "player", "sunshine", "morgan", "starwars", "boomer", "cowboys", "edward", "charles", "girls", "booboo", "coffee", "xxxxxx", "bulldog", "ncc1701", "rabbit", "peanut", "john", "johnny", "gandalf", "spanky", "winter", "brandy", "compaq", "carlos", "tennis", "james", "mike", "brandon", "fender", "anthony", "blowme", "ferrari", "cookie", "chicken", "maverick", "chicago", "joseph", "diablo", "sexsex", "hardcore", "666666", "willie", "welcome", "chris", "panther", "yamaha", "justin", "banana", "driver", "marine", "angels", "fishing", "david", "maddog", "hooters", "wilson", "butthead", "dennis", "captain", "bigdick", "chester", "smokey", "xavier", "steven", "viking", "snoopy", "blue", "eagles", "winner", "samantha", "house", "miller", "flower", "jack", "firebird", "butter", "united", "turtle", "steelers", "tiffany", "zxcvbn", "tomcat", "golf", "bond007", "bear", "tiger", "doctor", "gateway", "gators", "angel", "junior", "thx1138", "porno", "badboy", "debbie", "spider", "melissa", "booger", "1212", "flyers", "fish", "porn", "matrix", "teens", "scooby", "jason", "walter", "cumshot", "boston", "braves", "yankee", "lover", "barney", "victor", "tucker", "princess", "mercedes", "5150", "doggie", "zzzzzz", "gunner", "horney", "bubba", "2112", "fred", "johnson", "xxxxx", "tits", "member", "boobs", "donald", "bigdaddy", "bronco", "penis", "voyager", "rangers", "birdie", "trouble", "white", "topgun", "bigtits", "bitches", "green", "super", "qazwsx", "magic", "lakers", "rachel", "slayer", "scott", "2222", "asdf", "video", "london", "7777", "marlboro", "srinivas", "internet", "action", "carter", "jasper", "monster", "teresa", "jeremy", "11111111", "bill", "crystal", "peter", "pussies", "cock", "beer", "rocket", "theman", "oliver", "prince", "beach", "amateur", "7777777", "muffin", "redsox", "star", "testing", "shannon", "murphy", "frank", "hannah", "dave", "eagle1", "11111", "mother", "nathan", "raiders", "steve", "forever", "angela", "viper", "ou812", "jake", "lovers", "suckit", "gregory", "buddy", "whatever", "young", "nicholas", "lucky", "helpme", "jackie", "monica", "midnight", "college", "baby", "brian", "mark", "startrek", "sierra", "leather", "232323", "4444", "beavis", "bigcock", "happy", "sophie", "ladies", "naughty", "giants", "booty", "blonde", "golden", "0", "fire", "sandra", "pookie", "packers", "einstein", "dolphins", "0", "chevy", "winston", "warrior", "sammy", "slut", "8675309", "zxcvbnm", "nipples", "power", "victoria", "asdfgh", "vagina", "toyota", "travis", "hotdog", "paris", "rock", "xxxx", "extreme", "redskins", "erotic", "dirty", "ford", "freddy", "arsenal", "access14", "wolf", "nipple", "iloveyou", "alex", "florida", "eric", "legend", "movie", "success", "rosebud", "jaguar", "great", "cool", "cooper", "1313", "scorpio", "mountain", "madison", "987654", "brazil", "lauren", "japan", "naked", "squirt", "stars", "apple", "alexis", "aaaa", "bonnie", "peaches", "jasmine", "kevin", "matt", "qwertyui", "danielle", "beaver", "4321", "4128", "runner", "swimming", "dolphin", "gordon", "casper", "stupid", "shit", "saturn", "gemini", "apples", "august", "3333", "canada", "blazer", "cumming", "hunting", "kitty", "rainbow", "112233", "arthur", "cream", "calvin", "shaved", "surfer", "samson", "kelly", "paul", "mine", "king", "racing", "5555", "eagle", "hentai", "newyork", "little", "redwings", "smith", "sticky", "cocacola", "animal", "broncos", "private", "skippy", "marvin", "blondes", "enjoy", "girl", "apollo", "parker", "qwert", "time", "sydney", "women", "voodoo", "magnum", "juice", "abgrtyu", "777777", "dreams", "maxwell", "music", "rush2112", "russia", "scorpion", "rebecca", "tester", "mistress", "phantom", "billy", "6666", "albert");
    return commonPassword.includes(password);
}


class NormalSignupForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            legalname: '',
            logoURL: '',
            displayname: '',
            description: '',
            IBAN: '',
            email: '',
            password: '',
            repassword: '',
            signupBusinessUser: false,
            redirectURL: '/verify/email',
            formErrors: {
                legalname: '',
                logoURL: '',
                displayname: '',
                description: '',
                IBAN: '',
                email: '',
                password: '',
                repassword: ''
            },
            formValidity: {
                legalname: false,
                logoURL: false,
                displayname: false,
                description: false,
                IBAN: false,
                email: false,
                password: false,
                repassword: false
            },
            canSubmit: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.businessSignupSubmit = this.businessSignupSubmit.bind(this);
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
        const imageURLTest = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|svg)/;
        const ibanTest = /^\b[A-Z]{2}[0-9]{2}(?:[ ]?[0-9]{4}){4}(?!(?:[ ]?[0-9]){3})(?:[ ]?[0-9]{1,2})?\b/;

        validity[name] = value.length > 0;
        let capitalizeFirstLetter = function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} is required and cannot be empty.`);


        const {legalname} = this.state;

        if (validity[name]) {
            switch (name) {
                case "legalname": {
                    validity[name] = value.length >= 6;
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Please enter a correct legal name`);
                    break;
                }
                case "displayname": {
                    if (legalname.length < 6) {
                        fieldValidationErrors[name] = capitalizeFirstLetter(`Display name should be more than 6 characters`);
                        break;
                    }
                    validity[name] = value !== legalname;
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Legal name and displayname cannot' be equal`);
                    break;
                }
                case "description": {
                    validity[name] = value.length < 150;
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Description should be less than 150 characters`);
                    break;
                }

                case "IBAN": {
                    validity[name] = ibanTest.test(value);
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Please enter a valid IBAN`);
                    break;
                }
                case "logoURL": {
                    validity[name] = imageURLTest.test(value);
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Please enter a valid logo url`);
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
        const {legalname, logoURL, displayname, description, IBAN, email, password, repassword} = this.state.formValidity;
        this.setState({
            canSubmit:
                legalname &&
                logoURL &&
                displayname &&
                description &&
                IBAN &&
                email &&
                password &&
                repassword
        });
    }

    businessSignupSubmit = (event) => {
        event.preventDefault();
        this.setState({signupBusinessUser: true});

        const {legalname, logoURL, displayname, description, IBAN, email, password} = this.state;

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(businessSignUp_MUTATION),
            variables: {
                email: email,
                password: password,
                signupMethod: "Regular",
                legalname: legalname,
                logoURL: logoURL,
                displayname: displayname,
                description: description,
                IBAN: IBAN
            }
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
                    <Form onSubmit={this.businessSignupSubmit} className="login-form">
                        <Form.Item>
                            <label htmlFor="name">Legal name</label>
                            <input
                                className={`form-control ${this.errorClass(this.state.formErrors.legalname)}`}
                                id="legalname"
                                name="legalname"
                                type="text"
                                placeholder="Legal name"
                                value={this.state.legalname}
                                onChange={this.handleChange}
                            />
                            <div className="invalid-feedback">{this.state.formErrors.legalname}</div>
                            <small className="form-text text-muted">e.g. Spotify Technology S.A</small>
                        </Form.Item>
                        <Form.Item>
                            <label htmlFor="name">Display name</label>
                            <input
                                className={`form-control ${this.errorClass(this.state.formErrors.displayname)}`}
                                id="displayname"
                                name="displayname"
                                type="text"
                                placeholder="Display name"
                                value={this.state.displayname}
                                onChange={this.handleChange}
                            />
                            <div className="invalid-feedback">{this.state.formErrors.displayname}</div>
                            <small className="form-text text-muted">e.g. Spotify </small>
                        </Form.Item>

                        <Form.Item>
                            <label htmlFor="name">IBAN</label>
                            <input
                                className={`form-control ${this.errorClass(this.state.formErrors.IBAN)}`}
                                id="IBAN"
                                name="IBAN"
                                type="text"
                                placeholder="IBAN"
                                value={this.state.IBAN}
                                onChange={this.handleChange}
                            />
                            <div className="invalid-feedback">{this.state.formErrors.IBAN}</div>
                        </Form.Item>
                        <Form.Item>
                            <label htmlFor="name">Logo URL</label>
                            <input
                                className={`form-control ${this.errorClass(this.state.formErrors.logoURL)}`}
                                id="logoURL"
                                name="logoURL"
                                type="url"
                                placeholder="Logo url"
                                value={this.state.logoURL}
                                onChange={this.handleChange}
                            />
                            <div className="invalid-feedback">{this.state.formErrors.logoURL}</div>
                        </Form.Item>

                        <Form.Item>
                            <label htmlFor="name">Short description</label>
                                 <input
                                     className={`form-control ${this.errorClass(this.state.formErrors.description)}`}
                                     id="description"
                                     name="description"
                                     type="text"
                                     placeholder="Tell your customers about your venture"
                                     value={this.state.description}
                                     onChange={this.handleChange}
                                 />
                            <div className="invalid-feedback">{this.state.formErrors.description}</div>
                        </Form.Item>
                        <Form.Item>
                            <label htmlFor="email">Email</label>
                            <input
                                className={`form-control ${this.errorClass(this.state.formErrors.email)}`}
                                id="email"
                                name="email"
                                type="email"
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
                                {(signup_user_status === true) ? <Spin indicator={antIcon}/> : ''}
                                {(signup_user_status === true) ? '' : 'Sign up'}
                            </button>
                        </Form.Item>
                    </Form>
                    {this.renderRedirect()}
                    <div id="login-box-footer"
                         style={{padding: "10px 20px", paddingBottom: "23px", paddingTop: "18px"}}>
                        <p style={{marginBottom: "0px"}}> Already have an business account? <a id="register-link"
                                                                                      href="/business/login">Login!</a>
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