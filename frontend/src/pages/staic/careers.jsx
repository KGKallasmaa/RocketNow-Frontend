import React from "react";
import {Helmet} from "react-helmet";
import Footer from "../../components/footer.jsx";
import "../../assets/css/static/careers.min.css";
import galaxy from "../../assets/img/static/Galaxy.jpg";
import software from "../../assets/img/static/Software.jpg";
import design from "../../assets/img/static/Design.jpg";
import marketing from "../../assets/img/static/Marketing.jpg";



export default function Careers() {
    return (
        <React.Fragment>
            <Helmet>
                <title>Careers at RocketNow</title>
                <meta name="twitter:description"
                      content="Looking to build the shopping experience people in this galaxy deserve. #RocketNow"/>
                <meta name="twitter:title" content="Careers at RocketNow"/>
                <meta name="twitter:image" content={galaxy}/>
                <meta property="og:type" content="website"/>
                <meta name="description"
                      content="RocketNow is a company were to build strong and meaningful relationships with some of the smartest people in the Universe."/>
                <meta property="og:image" content={galaxy}/>
                <meta name="twitter:card" content="summary"/>
            </Helmet>
            <nav className="navbar navbar-light navbar-expand-lg fixed-top" id="mainNav">
                <div className="container"><a className="navbar-brand" href="/">RocketNow</a>
                    <button data-toggle="collapse" data-target="#navbarResponsive" className="navbar-toggler"
                            aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><i
                        className="fa fa-bars"/></button>
                    <div
                        className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="nav navbar-nav ml-auto">
                            <li className="nav-item" role="presentation"><a className="nav-link"
                                                                            href="/about">About</a></li>
                            <li className="nav-item" role="presentation"/>
                            <li className="nav-item" role="presentation"><a className="nav-link"
                                                                            href="/contact">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <header className="masthead" style={{
                backgroundImage: `url(${galaxy})`
            }}>
                <div className="overlay"/>
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 col-lg-8 col-xl-11 mx-auto">
                            <div class="site-heading">
                                <h1><strong>Careers</strong>&nbsp;at RocketNow</h1><span
                                className="text-left subheading"><strong>RocketNow is looking for people who want to create something new. You are always welcome to seek opportunities to join our team, especially if you who move fast, are not afraid of challenges.</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="container">
                <h1 className="text-center"><strong>Open positions</strong></h1>
            </div>
            <div className="team-boxed">
                <div className="container text-left">
                    <div className="intro"/>
                    <div className="row people">
                        <div className="col-md-6 col-lg-4 item">
                            <div className="box">
                                <img className="rounded-circle" src={software}
                                     alt={"SoftWare engineer career"}/>
                                <h4 className="name">Software engineer</h4>
                                <p className="title">React+Node.js+Graphql</p>
                                <p className="description">We're looking for someone to enhance and develop new
                                    full-stack
                                    features for our website.&nbsp;</p>
                                <div className="social"><a href="#"><i className="fa fa-envelope"/></a></div>
                                <a className="btn btn-primary btn-block btn-sm bg-primary border rounded" role="button"
                                   href="https://forms.gle/sSwYoRUo4tX8rvzz7">Apply
                                    now</a></div>
                        </div>
                        <div className="col-md-6 col-lg-4 item">
                            <div className="box"><img className="rounded-circle" src={design}
                                                      alt={"Designer career"}/>
                                <h4 className="name">Designer</h4>
                                <p className="title">UI+UX</p>
                                <p className="description">We're looking for someone to design the look and feel of the
                                    way
                                    the product &nbsp;is used.&nbsp;</p>
                                <div className="social"><a href="#"><i className="fa fa-envelope"/></a></div>
                                <a className="btn btn-primary btn-block btn-sm bg-primary border rounded" role="button"
                                   href="https://forms.gle/sSwYoRUo4tX8rvzz7">Apply
                                    now</a></div>
                        </div>
                        <div className="col-md-6 col-lg-4 item">
                            <div className="box"><img class="rounded-circle" src={marketing}
                                                      alt={"Marketing career"}/>
                                <h4 className="name">Marketing</h4>
                                <p className="title">retail+business</p>
                                <p className="description">We're looking for someone to develop our marketing strategy
                                    for
                                    retail and business clients.</p>
                                <div className="social"><a href="#"><i className="fa fa-envelope"/></a></div>
                                <a className="btn btn-primary btn-block btn-sm bg-primary border rounded" role="button"
                                   href="https://forms.gle/sSwYoRUo4tX8rvzz7">Apply
                                    now</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
            <script src="../../assets/js/static/career.js"/>
        </React.Fragment>
    );
};
