import React from 'react';
import Redirect from "react-router-dom/es/Redirect";
import 'instantsearch.css/themes/algolia.css';
import {InstantSearch, SearchBox} from 'react-instantsearch-dom';
import algoliasearch from "algoliasearch/lite";


const searchClient = algoliasearch(
    process.env.REACT_APP_ALGOLIA_API_KEY,
    process.env.REACT_APP_ALGOLIA_SEARCH_ONLY_KEY
);

export default class RocketNowSearchBox extends React.Component {
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
            query: (this.props.query !== undefined) ? this.props.query : "",
            type: (this.props.type !== undefined) ? this.props.type : ""
        });
    }

    handleSearch() {
        this.setState({
            redirect: true
        });
    };

    renderRedirect = () => {
        if (this.state.redirect === true) {
            const redirect_url = '/search/' + this.state.query;
            return <Redirect to={redirect_url}/>
        }
    };

    updateQuery(e) {
        e.preventDefault();
        this.setState({query: e.target.value});
    }


    render() {
        const {query, type} = this.state;
        if (type === "instant") {
            return (
                <SearchBox
                    defaultRefinement={query}
                    placeholder={"Search for anything"}
                    searchAsYouType={"false"}
                />
            );
        }
        return (
            <InstantSearch
                indexName="product"
                searchClient={searchClient}
            >
                <SearchBox
                    placeholder={"Search for anything"}
                    searchAsYouType={"false"}
                    onChange={this.updateQuery}
                    onSubmit={this.handleSearch}
                />
                {this.renderRedirect()}
            </InstantSearch>
        );
    }
}