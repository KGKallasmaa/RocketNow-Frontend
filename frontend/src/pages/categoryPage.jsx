import React from 'react';
import AcceptsCookies from "../components/legal/cookieConsent";

export default class CategoryPage extends React.PureComponent {
    render() {
        const category = this.props.match.params.category;
        return (
            <React.Fragment>
                Welcome to {category} page. The page is still under development.
                <AcceptsCookies/>
            </React.Fragment>
        );
    }
}