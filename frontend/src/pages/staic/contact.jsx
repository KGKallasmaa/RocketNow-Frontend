import React from "react";
import {Helmet} from "react-helmet";
import "../../assets/css/static/contact.min.css";
import Footer from "../../components/footer.jsx";
import {Navbar} from "../../components/navbar.jsx";
import {message} from "antd";


import ogLogo from "../../assets/img/og_Logo.png";
import {fetchData} from "../../components/fetcher";
import {contactForm_QUERY} from "./graphql/contactForm_QUERY";
import AcceptsCookies from "../../components/legal/cookie_consent";

const background = {backgroundColor: "#f7f7f7"};
const font = {fontFamily: "Catamaran"};
const sendButton = {backgroundColor: "#1F96FE"};
const contactUsHeader = {fontFamily: "Catamaran"};

export default class Contact extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.sendEmail = this.sendEmail.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }

    async sendEmail(event) {
        event.preventDefault();
        const {clientName, clientEmail, subject, clientMessage} = this.state;

        const variables = {
            clientName: clientName,
            clientEmail: clientEmail,
            subject: subject,
            clientMessage: clientMessage
        };
        let fetchSendingContactEmail = fetchData(variables, contactForm_QUERY);
        let contactEmail = await fetchSendingContactEmail;
        if (contactEmail !== null) {
            console.log(contactEmail);
            if (contactEmail.receiveContactFormMessage === true) {
                message.success("We received your message. We'll be in touch");
            } else {
                message.error("We have trouble receiving your message. Please try again.");
            }
        }
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>Contact us- RocketNow</title>
                    <meta name="twitter:description"
                          content="Please get in touch and let's start something wonderful together."/>
                    <meta name="twitter:title" content="Contact us- RocketNow"/>
                    <meta property="og:type" content="website"/>
                    <meta name="description"
                          content="Please get in touch and let's start something wonderful together."/>
                    <meta name="twitter:card" content="summary"/>
                    <meta property="og:image" content={ogLogo}/>
                    <meta name="twitter:image" content={ogLogo}/>
                </Helmet>
                <Navbar/>
                <br/><br/>
                <div style={{background}}>
                    <div className="container">
                        <br/><br/><br/>
                        <AcceptsCookies/>
                        <div className="row">
                            <div className="col-md-6">
                                <form onSubmit={this.sendEmail}>
                                    <h1 className="text-center" style={{contactUsHeader}}>Send us a message</h1>
                                    <div className="form-group">
                                        <input className="form-control" type="text" name="clientName"
                                               placeholder="Name" autoComplete="on" required="true"
                                               onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input className="form-control" type="text" name="subject" required="true"
                                               placeholder="Subject" autoComplete="on" onChange={this.handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <input className="form-control" type="text" name="clientEmail" required="true"
                                               placeholder="Email" autoComplete="on" inputMode="email"
                                               onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                    <textarea className="form-control" name="clientMessage"
                                              placeholder="Message" rows="14"
                                              required="true" onChange={this.handleChange}
                                    />
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block" type="submit"
                                                style={{sendButton}}>Send
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-12" style={{background}}>
                                        <br/><br/>
                                        <iframe allowFullScreen="" frameBorder="0"
                                                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyArway9oG2qWdikdiJcaxxnGqn14SgA6nw&amp;q=Maakri+36&amp;zoom=16"
                                                width="100%" height="400"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h2 style={{font}}>Contact details</h2>
                                        <p>Legal name: RocketNow OÜ</p>
                                        <p>Email: karl.gustav1789@gmail.com</p>
                                        <p>VAT: 12345</p>
                                        <p>IBAN: EE123456789101234</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div/>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <Footer/>
            </React.Fragment>
        );
    }
};