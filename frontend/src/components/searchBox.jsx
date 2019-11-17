import React from 'react';
import { Redirect } from 'react-router-dom';
import 'instantsearch.css/themes/algolia.css';
import {InstantSearch, SearchBox} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';


const searchClient = algoliasearch(
    process.env.REACT_APP_ALGOLIA_API_KEY,
    process.env.REACT_APP_ALGOLIA_SEARCH_ONLY_KEY
);

const style={
   width:"100%",
    marginBottom:"5px"
};

export default class RocketNowSearchBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            query: React.createRef()
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
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
        const query = (this.props.query !== undefined) ? this.props.query : "";
        const type = (this.props.type !== undefined) ? this.props.type : "";
        if (type === "instant") {
            return (
                <SearchBox
                    defaultRefinement={query}
                    placeholder={"Search for anything"}
                    searchAsYouType={false}
                />
            );
        }
        return (
            <div style={style}>
                    <InstantSearch
                        indexName="product"
                        searchClient={searchClient}
                    >
                        <SearchBox
                            placeholder={"Search for anything"}
                            searchAsYouType={false}
                            onChange={this.updateQuery}
                            onSubmit={this.handleSearch}
                        />
                        {this.renderRedirect()}
                    </InstantSearch>
            </div>
        );
    }
}