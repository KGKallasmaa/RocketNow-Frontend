import React from 'react';

const color = {color: "#ffffff"};

export default React.memo(() => {
        return (
            <div className="footer-dark">
                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 col-md-3 item">
                                <h3 style={color}>Services</h3>
                                <ul>
                                    <li><a aria-label={"Sell your goods on RocketNow"} href="/business/login">Sell on
                                        RocketNow</a></li>
                                    <li><a aria-label={"See the answers to the most frequently asked questions"}
                                           href="/faq">FAQ</a></li>
                                    <li><a aria-label={"Read the terms of service"} href="/tos">Terms of Service</a></li>
                                </ul>
                            </div>
                            <div className="col-sm-6 col-md-3 item">
                                <h3 style={color}>About</h3>
                                <ul>
                                    <li><a aria-label={"Read the story of RocketNow"} href="/about">About</a></li>
                                    <li><a aria-label={"See the careers that are currently available"}
                                           href="/careers">Careers</a></li>
                                    <li><a aria-label={"Please contact us for any inquiries"} href="/contact">Contact</a></li>
                                    <li><a aria-label={"Read some tips and tips about shopping online"}
                                           href="/blog">Blog</a></li>

                                </ul>
                            </div>
                            <div className="col-md-6 item text">
                                <h3 style={color}>RocketNow</h3>
                                <p style={color}>  A new e-commerce platform.</p>
                            </div>
                            <div className="col item social">
                                <a title={"View RocketNow on Facebook"} href="#"><i
                                    className="icon ion-social-facebook"/></a>
                                <a title={"View RocketNow on Instagram"} href="#"><i className="icon ion-social-instagram"/></a>
                                <a title={"View RocketNow on LinedIn"} href="#"><i
                                    className="icon ion-social-linkedin"/></a>
                            </div>
                        </div>
                        <p className="copyright">Made with&nbsp;❤️ &nbsp;in Estonia 🇪🇪</p>
                        <p className="copyright">© RocketNow OÜ 2019</p>
                    </div>
                </footer>
            </div>
        );
    }
);