import React, {lazy, Suspense} from "react";
import {Helmet} from "react-helmet";
import Footer from "../../components/footer.jsx";
import "../../assets/css/static/careers.min.css";
import galaxy from "./assets/img/Galaxy.webp";
import software from "./assets/img/Software.webp";
import design from "./assets/img/Design.webp";
import marketing from "./assets/img/Marketing.webp";
import AcceptsCookies from "../../components/cookieConsent";

const IndividualCareer = lazy(() => import("./components/IndividualCareer"));

export default class Careers extends React.PureComponent {
    render() {
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
                <AcceptsCookies/>
                <nav className="navbar navbar-light navbar-expand-lg fixed-top" id="mainNav">
                    <div className="container"><a className="navbar-brand" href="/" aria-label={"Go to homepage"}
                                                  style={{color: "white"}}>RocketNow</a>
                        <button data-toggle="collapse" data-target="#navbarResponsive" className="navbar-toggler"
                                aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><i
                            className="fa fa-bars"/></button>
                        <div
                            className="collapse navbar-collapse" id="navbarResponsive">
                            <ul className="nav navbar-nav ml-auto">
                                <li className="nav-item" role="presentation"><a className="nav-link"
                                                                                href="/about" aria-label={"Go to about page"}
                                                                                style={{color: "white"}}>About</a></li>
                                <li className="nav-item" role="presentation"/>
                                <li className="nav-item" role="presentation"><a className="nav-link" aria-label={"Go to contact page"}
                                                                                href="/contact"
                                                                                style={{color: "white"}}>Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <header className="masthead" style={{background: `url(${galaxy})`, backgroundPosition: "center"}}>
                    <div className="overlay"/>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 col-lg-8 col-xl-11 mx-auto" style={{color: "white"}}>
                                <div className="site-heading">
                                    <br/><br/><br/>
                                    <h1 style={{color: "white", textAlign: "center"}}><strong>Careers</strong>&nbsp;at
                                        RocketNow</h1>
                                    <span
                                        className="text-left subheading"><strong>RocketNow is looking for people who want to create something new. You are always welcome to seek opportunities to join our team, especially if you who move fast, are not afraid of challenges.</strong>
                                </span>
                                    <br/><br/><br/>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container">
                    <br/>
                    <h1 className="text-center"><strong>Open positions</strong></h1>
                    <br/>
                </div>
                <div className="team-boxed">
                    <div className="container text-left">
                        <div className="intro"/>
                        <div className="row people">
                            <Suspense fallback={"Loading"}>
                                <IndividualCareer name={"Software engineer"}
                                                  title={"React+Node.js+Graphql"}
                                                  img={software}
                                                  description={"We're looking for someone to enhance and develop new full-stack features for our website"}/>
                            </Suspense>
                            <Suspense fallback={"Loading"}>
                                <IndividualCareer name={"Designer"}
                                                  title={"UI+UX"}
                                                  img={design}
                                                  description={"We're looking for someone to design the look and feel of\n" +
                                                  "                                        the\n" +
                                                  "                                        way\n" +
                                                  "                                        the product is used."}/>
                            </Suspense>
                            <Suspense fallback={"Loading"}>
                                <IndividualCareer name={"Marketing"}
                                                  title={"retail+business"}
                                                  img={marketing}
                                                  description={"We're looking for someone to develop our marketing\n" +
                                                  "                                        strategy\n" +
                                                  "                                        for\n" +
                                                  "                                        retail and business clients."}/>
                            </Suspense>
                        </div>
                    </div>
                </div>
                <Footer/>
                <script src="../../assets/js/static/career.js"/>
            </React.Fragment>
        );
    }
};