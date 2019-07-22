import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <div className="footer-dark">
                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 col-md-3 item">
                                <h3 style={{color:"#ffffff"}}>Services</h3>
                                <ul>
                                    <li><a href="/rocketbusiness">Sell on RocketNow</a></li>
                                    <li><a href="/faq">FAQ</a></li>
                                    <li><a href="/tos">Terms of Service</a></li>
                                </ul>
                            </div>
                            <div className="col-sm-6 col-md-3 item">
                                <h3 style={{color:"#ffffff"}}>About</h3>
                                <ul>
                                    <li><a href="/about">About</a></li>
                                    <li><a href="/careers">Careers</a></li>
                                    <li><a href="/blog">Blog</a></li>
                                    <li><a href="/sitemap">Sitemap</a></li>
                                </ul>
                            </div>
                            <div className="col-md-6 item text">
                                <h3 style={{color:"#ffffff"}}>RocketNow</h3>
                                <p>A new e-commerce platform.</p>
                            </div>
                            <div className="col item social"><a href="#"><i
                                className="icon ion-social-facebook"/></a><a
                                href="#"><i className="icon ion-social-instagram"/></a></div>
                        </div>
                        <p className="copyright">Made with&nbsp;❤️ &nbsp;in Estonia 🇪🇪</p>
                        <p className="copyright">© RocketNow OÜ 2019</p>
                    </div>
                </footer>
            </div>
        )
    }
}