import React from 'react';
import {message} from 'antd';
import {AddToCart} from '../components/modifyCart';
import {Navbar} from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import {SEARCH_QUERY} from "../graphql/search_QUERY";
import "../assets/css/searchresults.css";
import axios from 'axios';
import {print} from 'graphql';
import {LazyLoadImage} from "react-lazy-load-image-component";
import {Helmet} from "react-helmet";
import algoliasearch from 'algoliasearch/lite';
import {InstantSearch, Pagination, Highlight, RefinementList, Menu,connectHits, CurrentRefinements} from 'react-instantsearch-dom';

const searchClient = algoliasearch(
    process.env.REACT_APP_ALGOLIA_API_KEY,
    process.env.REACT_APP_ALGOLIA_SEARCH_ONLY_KEY
);

const currency_display_dictionary = {
    'EUR': '€',
    'USD': '$',
    'RUB': '₽',
    'GBP': '£',
    'CNY': '¥',
    'JPY': '¥',
    'CHF': 'Fr'
};

const category_and_tax = {
    "Music": 0.2,
    "Books": 0.09,
    "Pet Supplies": 0.2,
    "Sports and Outdoors": 0.2,
    "Baby": 0.2,
    "Automotive": 0.2,
    "Arts and Crafts": 0.2,
    "Beauty and Personal Care": 0.2,
    "Computers": 0.2,
    "Electronics": 0.2,
    "Women's Fashion": 0.2,
    "Men's Fashion": 0.2,
    "Girls' Fashion": 0.2,
    "Boys' Fashion": 0.2,
    "Health and Household": 0.2,
    "Home and Kitchen": 0.2,
    "Industrial and Scientific": 0.2,
    "Luggage": 0.2,
    "Movies and Television": 0.2,
    "Software": 0.2,
    "Tools and Home Improvement": 0.2,
    "Toys and Games": 0.2,
    "Video Games": 0.2,
    "Groceries and Gourmet Food": 0.2,
};

function renderSearchResults(good) {
    const price = Math.ceil(100 * (good.current_price * (1 + category_and_tax[good.category]))) / 100;
    const good_url = "/goods/" + good.nr + "/" + good.title;
    return (
        <div className="col-lg-4 col-sm-6">
            <div className="product-item">
                <div className="pi-pic">
                    <a title={good.title} href={good_url}>
                        <LazyLoadImage
                            alt={good.title}
                            src={good.imgage}
                        />
                    </a>
                    <div className="pi-links">
                        <AddToCart good_id={good._id} title={good.title} quantity={1}/>
                    </div>
                </div>
                <div className="pi-text">
                    <h6>{currency_display_dictionary[good.currency]}{price}</h6>
                    <Highlight hit={good} attribute="title" />
                </div>
            </div>
        </div>
    );
}

function renderNonQuantiativeRefinement(refinement) {
    if (refinement) {
        const upperCaseName = refinement.charAt(0).toUpperCase() + refinement.slice(1);
        return (
            <div className="filter-widget">
                <h2 className="fw-title">{upperCaseName}</h2>
                <ul className="sub-menu">
                    <RefinementList
                        attribute={refinement}
                    />
                </ul>
            </div>
        );
    }
    return "";
}

function renderQuantiativeRefinement(refinement) {
    if (refinement) {
        const upperCaseName = refinement.charAt(0).toUpperCase() + refinement.slice(1);
        return (
            <div className="filter-widget">
                <h2 className="fw-title">{upperCaseName}</h2>
                <ul className="sub-menu">
                    <Menu
                        attribute={refinement}
                    />
                </ul>
            </div>
        );
    }
    return "";
}


const Hits = ({hits}) => (
    <div className="col-lg-9  order-1 order-lg-2 mb-5 mb-lg-0">
        <div className="row">
            {hits.map(hit => renderSearchResults(hit)
            )}
        </div>
    </div>
);
const CustomHits = connectHits(Hits);


export default class searchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refinemenetsDidMount: false
        };
        this.renderSearch = this.renderSearch.bind(this);
    }

    renderSearch() {
        const variables = {
            query: this.props.match.params.query,
        };

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(SEARCH_QUERY),
            variables: variables

        }).then(async resData => {
                const base = resData.data.data.search;
                this.setState({
                    nonNumericRefinements: base.nonNumericRefinements,
                    numericRefinements: base.numericRefinements
                });
            }
        ).catch(error => {
            if (error.response) {
                if (error.response.data) {
                    if (error.response.data.errors[0]) {
                        const errorMessage = error.response.data.errors[0].message;
                        if (errorMessage !== null) {
                            message.error(errorMessage);
                        }
                    }
                }
            }
        });
    }

    componentDidMount() {
        this.renderSearch();
    }

    render() {
        const query = this.props.match.params.query;
        const {nonNumericRefinements, numericRefinements} = this.state;
        const cannonial_url = process.env.REACT_APP_PUBLIC_URL + "/search/" + query;
        return (
            <div>
                <Helmet>
                    <title>RocketNow: {query}</title>
                    <link rel="canonial" href={cannonial_url}/>
                </Helmet>
                <InstantSearch
                    indexName="product"
                    searchClient={searchClient}
                >
                    <Navbar query={query} type={"instant"}/>
                    <div className="page-top-info">
                        <div className="container">
                            <h5>Showing results for "<b>{query}</b>"</h5>
                            <CurrentRefinements/>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 order-2 order-lg-1">
                                <div className="filter-widget">
                                    <h2 className="fw-title">Category</h2>
                                    <ul className="sub-menu">
                                        <RefinementList
                                            attribute="category"
                                        />
                                    </ul>
                                </div>
                                <hr/>
                                {(nonNumericRefinements !== undefined) ? nonNumericRefinements.map(renderNonQuantiativeRefinement) :
                                    <p/>}
                                <hr/>
                                {(numericRefinements !== undefined) ? numericRefinements.map(renderQuantiativeRefinement) :
                                    <p/>}
                            </div>
                            <br/><br/>
                            <CustomHits/>
                            <br/><br/>
                        </div>
                        <br/><br/><br/><br/><br/><br/> <br/>
                        <Pagination />
                        <br/><br/><br/><br/><br/>
                    </div>
                </InstantSearch>
                <Footer/>
                <script src="../assets/js/main.js"/>
            </div>
        )
    }
}
//TODO: range filtering for quantitative atributes
//TODO: add pagnition