import React, {Fragment} from 'react';
import {Divider, Empty, Rate, Skeleton} from 'antd';
import {AddToCart} from '../components/modifyCart';
import {Navbar} from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import {Query} from 'react-apollo';
import {Helmet} from "react-helmet";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {formatTimeStamp} from "../components/relativeTimestamp";
import {REFINEMENT_QUERY} from "../graphql/refinement_QUERY";
import {SEARCH_QUERY} from "../graphql/search_QUERY";


function show_EmptyState(nr_of_items, text) {
    if (nr_of_items === 0) return (<Empty description={text}/>);
}


function renderSearchResults(good) {
    const id = good._id;
    const title = good.title;
    const main_image = good.main_image_cloudinary_secure_url;
    const seller_name = good.seller.businessname;

    const listing_date = formatTimeStamp(good.listing_timestamp);
    const currency = good.currency;
    const tax = good.general_category.tax;
    const price = Math.round(100 * (good.current_price*(1+tax))) / 100;
    const quantity = good.quantity;

    const product_url = "/goods/" + good.nr + "/" + title;
    const seller_url = "/seller/" + good.seller.nr + "/" + seller_name;

    return (
        <div className="col-md-12">
            <div className="row">
                <div className="col-md-1"/>
                <div className="col-md-2">
                    <LazyLoadImage
                        alt={title}
                        src={main_image}
                        width="100px"
                    />
                </div>
                <div className="col-md-7">
                    <h4><a href={product_url}>{title}</a></h4>
                    <small>{listing_date}</small>
                    <small> by <a href={seller_url}>{seller_name}</a></small>
                    <br/>
                    <br/>
                    <br/>
                </div>
                <div className="col-md-2">
                    <h3>{price}&nbsp;{currency}</h3>
                    <AddToCart style={{
                        marginLeft: "0px",
                        width: "auto",
                        paddingLeft: "0px",
                        minWidth: "150px",
                        paddingRight: "0px"
                    }} disabled={(quantity === 0)} title={title} quantity={1} good_id={good._id}/>
                </div>
            </div>
            <Divider/>
        </div>
    );
}

function renderRefinements(goods) {
    //Prevent showing duplicate information
    let already_showed_categories = new Set();

    let show_categories = [];
    for (let i = 0; i < goods.length; i++) {
        const good = goods[i];
        //Have we shown that category to the customer yet?
        if (!already_showed_categories.has(good.general_category.name)) {
            show_categories.push(<p><b>{good.general_category.name}</b></p>);
            already_showed_categories.add(good.general_category.name);
        }
    }
    //toodo: develop
    return (
        <div>
            {show_categories}
        </div>
    );
    /*
     <p><b>Category 1</b></p>
            <p>Category 1.1</p>
            <p>Category 1.2</p>
            <p><b>Category 2</b></p>
            <p><b>Category 3</b></p>
     */
}

//Refine data
//todo: develop
function min_avg_rating(value) {
    return 5
}

export default class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            min_rating: 1,
            page_nr: 1,
            loading: false,
            general_categories: ["fake"]
        }
    }

    render() {
        const query = this.props.match.params.query;

        const page_nr = (typeof this.props.match.params.page_nr != 'undefined' && this.props.match.params.page_nr) ? Math.max(parseInt(this.props.match.params.page_nr), this.state.page_nr, 1) : 1;

        //TODO: add page_nr support

        const keywords = [query, "RocketNow"];
        const cannonial_url = process.env.REACT_APP_PUBLIC_URL + "/search/" + query;
        //TODO: develop funcionality
        const {min_rating} = this.state;

        return (
            <div>
                <div>
                    <Navbar query={query}/>
                    <Helmet>
                        <title>RocketNow: {query}</title>
                        <meta name="keywords" content={keywords}/>
                        <link rel="canonial" href={cannonial_url}/>
                    </Helmet>
                    <br/>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="select-cathegory">
                                            <h1>
                                                <small>Categories</small>
                                            </h1>
                                            <Fragment>
                                                <Query query={REFINEMENT_QUERY} variables={{query, page_nr}}>
                                                    {({data, loading, error}) => {
                                                        if (loading) return <Skeleton loading={true}/>;
                                                        if (error) console.log(error);
                                                        if (typeof data != 'undefined' && data) {
                                                            if (data.search.length === 0) {
                                                                return show_EmptyState(0, "")
                                                            }
                                                            return renderRefinements(data.search);
                                                        }
                                                    }
                                                    }
                                                </Query>
                                            </Fragment>
                                        </div>
                                        <Divider/>
                                        <div className="refine">
                                            <h1>
                                                <small>Refine by</small>
                                            </h1>
                                            <p><b>Average customer rating</b></p>
                                            <Rate onChange={min_avg_rating} value={min_rating} count="4"/>
                                            {min_rating &&
                                            <span className="ant-rate-text">{min_rating} Stars & Up</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <Fragment>
                                            <Query query={SEARCH_QUERY} variables={{query, page_nr}}>
                                                {({data, loading, error}) => {
                                                    if (loading) return <Skeleton loading={true} active avatar/>;
                                                    if (error) console.log(error);
                                                    if (typeof data != 'undefined' && data) {
                                                        if (data.search.length === 0) {
                                                            return show_EmptyState(0, "No items found")
                                                        }
                                                        return data.search.map(renderSearchResults)
                                                    }
                                                }
                                                }
                                            </Query>
                                        </Fragment>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        )
    }
}
//TODO: filter by raitings