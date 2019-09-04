import React from 'react';
import {message, Checkbox, Slider, Skeleton, Empty} from 'antd';
import {AddToCart} from '../components/modifyCart';
import {Navbar} from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import {SEARCH_QUERY} from "../graphql/search_QUERY";

import "../assets/css/searchresults.css";
import axios from 'axios';
import {print} from 'graphql';
import {REFINEMENT_QUERY} from "../graphql/refinement_QUERY";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {Helmet} from "react-helmet";

const currency_display_dictionary = {
    'EUR': '€',
    'USD': '$',
    'RUB': '₽',
    'GBP': '£',
    'CNY': '¥',
    'JPY': '¥',
    'CHF': 'Fr'
};

function show_EmptyState(nr_of_items, text) {
    if (nr_of_items === 0) return (<Empty description={text}/>);
}

function renderSearchResults(good) {
    let price = good.current_price * (1 + good.general_category.tax);
    price = Math.ceil(100 * price) / 100;
    const good_url = "/goods/" + good.nr + "/" + good.title;
    return (
        <div className="col-lg-4 col-sm-6">
            <div className="product-item">
                <div className="pi-pic">
                    <a title={good.title} href={good_url}>
                        <LazyLoadImage
                            alt={good.title}
                            src={good.main_image_cloudinary_secure_url}
                        />
                    </a>
                    <div className="pi-links">
                        <AddToCart good_id={good._id} title={good.title} quantity={1}/>
                    </div>
                </div>
                <div className="pi-text">
                    <h6>{currency_display_dictionary[good.currency]}{price}</h6>
                    <p>{good.title}</p>
                </div>
            </div>
        </div>
    );
}

function loadingSearchRows(componentDidMount) {
    if (componentDidMount) {
        return "";
    }
    return (
        <div className="row">
            <div className="col-lg-4 col-sm-6">
                <div className="product-item">
                    <div className="pi-pic">
                        <Skeleton shape="square" avatar title={false}/>
                    </div>
                    <div className="pi-text">
                        <Skeleton paragraph={{rows: 2}}/>
                    </div>
                    <br/>
                    <div className="pi-text">
                        <Skeleton paragraph={{rows: 1}}/>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-sm-6">
                <div className="product-item">
                    <div className="pi-pic">
                        <Skeleton avatar title={false} paragraph={{rows: 0}}/>
                    </div>
                    <div className="pi-text">
                        <Skeleton paragraph={{rows: 2}}/>
                    </div>
                    <br/>
                    <div className="pi-text">
                        <Skeleton paragraph={{rows: 1}}/>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-sm-6">
                <div className="product-item">
                    <div className="pi-pic">
                        <Skeleton avatar title={false} paragraph={{rows: 0}}/>
                    </div>
                    <div className="pi-text">
                        <Skeleton paragraph={{rows: 2}}/>
                    </div>
                    <br/>
                    <div className="pi-text">
                        <Skeleton paragraph={{rows: 1}}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

function loadingRefinements(componentDidMount) {
    if (componentDidMount) {
        return "";
    }
    return (
        <div>
            <div className="filter-widget">
                <h2 className="fw-title">Categories</h2>
                <ul className="sub-menu">
                    <Skeleton paragraph={{rows: 4}}/>
                </ul>
            </div>
            <div className="filter-widget">
                <h2 className="fw-title">Price</h2>
                <ul className="sub-menu">
                    <Skeleton paragraph={{rows: 1}}/>
                </ul>
            </div>
            <div className="filter-widget">
                <Skeleton paragraph={{rows: 4}}/>
            </div>
            <div className="filter-widget">
                <Skeleton paragraph={{rows: 4}}/>
            </div>
            <div className="filter-widget">
                <Skeleton paragraph={{rows: 4}}/>
            </div>
        </div>
    );
};


export default class searchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            excecutionTime: new Date().getTime() / 1000,
            componentDidMount: false
        };
        this.renderCategories = this.renderCategories.bind(this);
        this.renderNonDeterministicQuantitativeAttribute = this.renderNonDeterministicQuantitativeAttribute.bind(this);
        this.renderQualitativeAttribute = this.renderQualitativeAttribute.bind(this);
        this.renderQuanitativeAttributeSlider = this.renderQuanitativeAttributeSlider.bind(this);
        this.renderSearch = this.renderSearch.bind(this);
        this.renderRefinements = this.renderRefinements.bind(this);
        this.setAllowedQualitativeAttribute = this.setAllowedQualitativeAttribute.bind(this);
        this.setMinQuantitativeAttributeValue = this.setMinQuantitativeAttributeValue.bind(this);
        this.renderNonDeterministicQuanitativeAtributes = this.renderNonDeterministicQuanitativeAtributes.bind(this);
        this.renderNonDeterministicQualitativeAtributes = this.renderNonDeterministicQualitativeAtributes.bind(this);
    }

    renderCategories(categories) {
        if (categories.length > 0) {
            return (
                <div className="filter-widget">
                    <h2 className="fw-title">Categories</h2>
                    <ul className="sub-menu">
                        {
                            categories.map(category => (
                                <div>
                                    <Checkbox value={category} name={"category"}
                                              onChange={this.setAllowedQualitativeAttribute}>{category}</Checkbox>
                                    <br/>
                                </div>
                            ))
                        }
                    </ul>
                </div>
            );
        }
    }

    renderNonDeterministicQuantitativeAttribute(tisplayName, name, min, max) {
        return (
            <div className="filter-widget">
                <h2 className="fw-title">{tisplayName}</h2>
                <ul className="sub-menu">
                    {this.renderQuanitativeAttributeSlider(name, min, max)}
                </ul>
            </div>
        );
    }

    renderQualitativeAttribute(label, values) {
        return (
            <div className="filter-widget">
                <h2 className="fw-title">{label}</h2>
                <ul className="sub-menu">
                    {
                        values.map(value => (
                            <div>
                                <Checkbox name={label} value={value}
                                          onChange={this.setAllowedQualitativeAttribute}>{value}</Checkbox>
                                <br/>
                            </div>
                        ))
                    }
                </ul>
            </div>
        );
    }

    setAllowedQualitativeAttribute(e) {
        e.preventDefault();
        const name = this.state.e.target.name;
        if (name === undefined && e.target.checked) {
            this.setState({
                    name: [e.target.value]
                }
            );
        } else if (e.target.checked) {
            this.setState({
                    name: this.state.e.target.name.concat([e.target.value])
                }
            );
        } else {

            for (let i = 0; i < name.length; i++) {
                if (name[i] === e.target.value) {
                    name.splice(i, 1);
                }
            }

            this.setState({
                    name: name
                }
            );
        }
    }

    setMinQuantitativeAttributeValue(e) {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value})
    }


    renderQuanitativeAttributeSlider(name, originalMin, orginalMax) {
        const min = parseInt(originalMin, 10);
        const max = parseInt(orginalMax, 10);
        const defaultValue = (min + max) / 2;

        return (
            <Slider defaultValue={defaultValue} min={min} max={max}/>
        );
    }

    renderNonDeterministicQuanitativeAtributes(numbericRefinements) {
        let returnArray = [];
        for (let i = 0; i < numbericRefinements.length; i += 3) {
            const slider = this.renderNonDeterministicQuantitativeAttribute(numbericRefinements[i], numbericRefinements[i], numbericRefinements[i + 1], numbericRefinements[i + 2]);
            if (returnArray.length < 1) {
                returnArray = [slider]
            } else {
                returnArray = returnArray.concat(slider)
            }
        }
        return returnArray;
    }

    renderNonDeterministicQualitativeAtributes(qualitativeRefinements) {
        let retturnArray = [];
        let j = 1;
        for (let i = 0; i < qualitativeRefinements.length; i += j) {
            const attributeName = qualitativeRefinements[i].substring(1);
            let attriButeValues = [];
            for (let k = i + 1; k < qualitativeRefinements.length; k++) {
                const element = qualitativeRefinements[k];
                if (element.includes("#")) {
                    k += qualitativeRefinements.length;
                } else if (attriButeValues.length < 1) {
                    attriButeValues = [element]
                } else {
                    attriButeValues = attriButeValues.concat([element]);
                }
            }
            j = attriButeValues.length + 1;
            const checkBoxes = this.renderQualitativeAttribute(attributeName, attriButeValues);

            if (retturnArray.length < 1) {
                retturnArray = [checkBoxes]
            } else {
                retturnArray = retturnArray.concat(checkBoxes)
            }
        }
        return retturnArray;
    }


    renderRefinements() {
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(REFINEMENT_QUERY),
            variables: {
                query: this.props.match.params.query,
            }
        }).then(async resData => {
            const base = resData.data.data.refine;
            const time = new Date().getTime() / 1000 - this.state.excecutionTime;
            this.setState({
                total: base.total,
                categories: base.categories,
                minPrice: base.minPrice,
                maxPrice: base.maxPrice,
                numbericRefinements: base.numbericRefinements,
                nonNumbericRefinements: base.nonNumbericRefinements,
                componentDidMount: true,
                excecutionTime: Math.ceil(100 * time) / 100,
            });

        }).catch(error => {
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

    renderSearch() {
        const variables = {
            query: this.props.match.params.query,
            page_nr: (typeof this.props.match.params.page_nr != 'undefined' && this.props.match.params.page_nr) ? Math.max(parseInt(this.props.match.params.page_nr), this.state.page_nr, 1) : 1
        };

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(SEARCH_QUERY),
            variables: variables

        }).then(async resData => {
                if (resData.data.data.search.length > 0) {
                    this.setState({
                        searchResults: resData.data.data.search,
                    });
                } else {
                    this.setState({
                        searchResults: "noResults",
                    });
                }
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
        this.renderRefinements();

    }

    render() {
        const query = this.props.match.params.query;
        const {searchResults, total, excecutionTime, componentDidMount, categories, minPrice, maxPrice, numbericRefinements, nonNumbericRefinements} = this.state;
        const cannonial_url = process.env.REACT_APP_PUBLIC_URL + "/search/" + query;
        return (
            <div>
                <Navbar query={query}/>
                <Helmet>
                    <title>RocketNow: {query}</title>
                    <link rel="canonial" href={cannonial_url}/>
                </Helmet>
                <div className="page-top-info">
                    <div className="container">
                        <h5>Showing results for "<b>{query}</b>"</h5>
                        {(componentDidMount !== false) ? (
                            <p>Number of results <b>{total}</b> ({excecutionTime} seconds)</p>) : <p/>}
                    </div>
                </div>
                <section className="category-section spad">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 order-2 order-lg-1">
                                {loadingRefinements(componentDidMount)}
                                {(categories !== undefined) ? (this.renderCategories(categories)) : <p/>}
                                {(minPrice !== undefined && searchResults !== undefined && searchResults != "noResults") ? (this.renderNonDeterministicQuantitativeAttribute("Price", "minPrice", minPrice, maxPrice)) :
                                    <p/>}
                                {(numbericRefinements !== undefined && searchResults != "noResults") ? (this.renderNonDeterministicQuanitativeAtributes(numbericRefinements)) :
                                    <p/>}
                                {(nonNumbericRefinements !== undefined && searchResults != "noResults") ? (this.renderNonDeterministicQualitativeAtributes(nonNumbericRefinements)) :
                                    <p/>}
                            </div>
                            <div className="col-lg-9  order-1 order-lg-2 mb-5 mb-lg-0">
                                {loadingSearchRows(componentDidMount)}
                                <div className="row">
                                    {(searchResults !== undefined && searchResults !== "noResults") ? searchResults.map(renderSearchResults) :
                                        <p/>}
                                    {(searchResults === "noResults") ? show_EmptyState(0, "No results found. Try searching for something else") :
                                        <p/>}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer/>
                <script src="../assets/js/main.js"></script>
            </div>
        )
    }
}
