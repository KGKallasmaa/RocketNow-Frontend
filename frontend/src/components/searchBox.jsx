import React from 'react';
import Redirect from "react-router-dom/es/Redirect";
import "../assets/css/searchbox.min.css"

export default class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            query: React.createRef()
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
    }

    componentDidMount() {
            this.setState({
                query: (this.props.query !== undefined) ? this.props.query : ""
            });
    }

    handleSearch() {
        this.setState({
            redirect: true
        });
    };

    renderRedirect = () => {
        if (this.state.redirect === true) {
            const query = this.state.query;
            const redirect_url = '/search/' + query;
            return <Redirect to={redirect_url}/>
        }
    };
    updateQuery(e) {
        e.preventDefault();
        this.setState({query: e.target.value})
    }
    render() {
        const query = this.state.query;
        return (
            <form id="search-form" onSubmit={this.handleSearch}>
                <div id="search-box">
                    <input type="search" name="search-box"  aria-label={"Search for products on RocketNow"} onChange={this.updateQuery} value={query} placeholder="Search for anything" min={1}/>
                    <i className="fa fa-search" aria-hidden="true"/>
                    {this.renderRedirect()}
                </div>
            </form>
        );
    }
}