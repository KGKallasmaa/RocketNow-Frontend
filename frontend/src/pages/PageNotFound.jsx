import React from 'react';
import Helmet from "react-helmet/es/Helmet";
import "../assets/css/pageNotFound.min.css";


export default class PageNotFound extends React.PureComponent {
    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,900" rel="stylesheet"/>
                    <title>Page not found</title>
                </Helmet>
                <div id="notfound">
                    <div className="notfound">
                        <div className="notfound-404">
                            <h1>Oops!</h1>
                        </div>
                        <h2>404 - Page not found</h2>
                        <p>The page you are looking for might have been removed had its name changed or is temporarily
                            unavailable.</p>
                        <a href="/">Go To Homepage</a>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};