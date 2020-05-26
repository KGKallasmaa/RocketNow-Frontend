import React from 'react';
import '../../../assets/css/home.min.css';
import { Navbar } from '../../../components/navbar';
import Footer from '../../../components/footer';
import axios from 'axios';
import { print } from 'graphql';
import { message } from 'antd';
import 'antd/es/message/style/css';

import { AddToCart } from '../../../components/modifyCart.jsx';
import { RECOMMEND_GOOD_QUERY } from '../../../graphql/reccomendGood_QUERY';
import { BEST_SELLING_QUERY } from '../../../graphql/bestSelling_QUERY';
import { TRENDING_GOOD_QUERY } from '../../../graphql/trending_good_QUERY';
import AcceptsCookies from '../../../components/cookieConsent.jsx';
import LazyLoad from 'react-lazyload';

const currency_display_dictionary = {
  EUR: '€',
  USD: '$',
  RUB: '₽',
  GBP: '£',
  CNY: '¥',
  JPY: '¥',
  CHF: 'Fr',
};

function renderSingleCategory(good) {
  return (
    <li>
      <a href="#">{good.general_category.name}</a>
    </li>
  );
}

function renderSingleTrendingResult(good) {
  let price = good.current_price * (1 + good.general_category.tax);
  price = Math.ceil(100 * price) / 100;
  const good_url = '/goods/' + good.nr + '/' + good.title;

  return (
    <div className="col-lg-4 col-sm-6">
      <div className="product-item">
        <div className="pi-pic">
          <a title={good.title} href={good_url}>
            <LazyLoad>
              <img alt={good.title} src={good.main_image_cloudinary_secure_url} />
            </LazyLoad>
          </a>
          <div className="pi-links">
            <AddToCart good_id={good._id} title={good.title} quantity={1} />
          </div>
        </div>
        <div className="pi-text">
          <h6>
            {currency_display_dictionary[good.currency]}
            {price}
          </h6>
          <p>{good.title}</p>
        </div>
      </div>
    </div>
  );
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    axios
      .post(process.env.REACT_APP_SERVER_URL, {
        query: print(TRENDING_GOOD_QUERY),
      })
      .then(async (resData) => {
        if (resData.data.data.trending.length > 0) {
          this.setState({
            trending: resData.data.data.trending,
          });
        } else {
          this.setState({
            trending: 'noResults',
          });
        }
      })
      .catch((error) => {
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
    const regular_token = sessionStorage.getItem('jwtToken');
    const jwt_token = regular_token !== null ? regular_token : sessionStorage.getItem('temporary_user_id');

    axios
      .post(process.env.REACT_APP_SERVER_URL, {
        query: print(RECOMMEND_GOOD_QUERY),
        variables: {
          jwt_token: jwt_token,
          nr: 6,
        },
      })
      .then(async (resData) => {
        if (resData.data.data.recommend.length > 0) {
          this.setState({
            reccomend: resData.data.data.recommend,
          });
        } else {
          this.setState({
            reccomend: 'noResults',
          });
        }
      })
      .catch((error) => {
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

    axios
      .post(process.env.REACT_APP_SERVER_URL, {
        query: print(BEST_SELLING_QUERY),
        variables: {
          nr: 6,
        },
      })
      .then(async (resData) => {
        if (resData.data.data.bestselling.length > 0) {
          this.setState({
            bestselling: resData.data.data.bestselling,
          });
        } else {
          this.setState({
            bestselling: 'noResults',
          });
        }
      })
      .catch((error) => {
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

  render() {
    const { trending, reccomend, bestselling } = this.state;
    return (
      <React.Fragment>
        <Navbar />
        <br />
        <br />
        <br />
        <br />
        <AcceptsCookies />
        <section className="product-filter-section">
          <div className="container">
            <div className="section-title">
              <h2>Recommendations </h2>
            </div>
            <ul className="product-filter-menu">
              {reccomend !== undefined && reccomend !== 'noResults' ? reccomend.map(renderSingleCategory) : <p />}
            </ul>
            <div className="row">
              {reccomend !== undefined && reccomend !== 'noResults' ? reccomend.map(renderSingleTrendingResult) : <p />}
            </div>
          </div>
        </section>
        <section className="product-filter-section">
          <div className="container">
            <div className="section-title">
              <h2>Trending </h2>
            </div>
            <ul className="product-filter-menu">
              {trending !== undefined && trending !== 'noResults' ? trending.map(renderSingleCategory) : <p />}
            </ul>
            <div className="row">
              {trending !== undefined && trending !== 'noResults' ? trending.map(renderSingleTrendingResult) : <p />}
            </div>
          </div>
        </section>
        <section className="product-filter-section">
          <div className="container">
            <div className="section-title">
              <h2>Best sellers </h2>
            </div>
            <ul className="product-filter-menu">
              {bestselling !== undefined && bestselling !== 'noResults' ? bestselling.map(renderSingleCategory) : <p />}
            </ul>
            <div className="row">
              {bestselling !== undefined && bestselling !== 'noResults' ? (
                bestselling.map(renderSingleTrendingResult)
              ) : (
                <p />
              )}
            </div>
          </div>
        </section>
        <Footer />
      </React.Fragment>
    );
  }
}
