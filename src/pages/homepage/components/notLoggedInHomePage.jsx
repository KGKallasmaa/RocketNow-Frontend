import React from 'react';
import { Navbar } from '../../../components/navbar';
import Footer from '../../../components/footer';
import { Helmet } from 'react-helmet';
import '../assets/css/notLoggedInHome.min.css';
import '../assets/css/bootstrap.min.css';

import algolia from '../assets/img/algolia.webp';
import choice from '../assets/img/choice.webp';
import delivery from '../assets/img/delivery.webp';
import digitalGoods from '../assets/img/digital_goods.webp';
import electronics from '../assets/img/electronics.webp';
import entertainment from '../assets/img/entartainment.webp';
import messenger from '../assets/img/facebook-messenger.svg';
import fashion from '../assets/img/fashion.webp';
import healthAndBeauty from '../assets/img/health_and_beauty.webp';
import mailChimp from '../assets/img/mail_chimp.webp';
import shippo from '../assets/img/shippo.webp';
import stripe from '../assets/img/stripe.webp';
import subscription from '../assets/img/subscriptions.webp';
import support from '../assets/img/support.webp';

import AcceptsCookies from '../../../components/cookieConsent';

import LazyLoad from 'react-lazyload';
const fontSize = { fontSize: '20px' };

export default React.memo(() => {
  return (
    <React.Fragment>
      <Helmet>
        <link rel="canonial" href="http://rocketnow.eu" />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
      </Helmet>
      <Navbar />
      <header className="masthead text-center text-white">
        <div className="masthead-content">
          <div className="container text-left">
            <h1 className="text-left masthead-heading mb-0">RocketNow</h1>
            <h2 className="text-left masthead-subheading mb-0">Shop for everything</h2>
          </div>
        </div>
        <div />
        <div className="bg-circle-1 bg-circle" />
        <div className="bg-circle-2 bg-circle" />
        <div className="bg-circle-3 bg-circle" />
      </header>
      <AcceptsCookies />
      <div className="brands">
        <a href="/about" aria-label={'Read the story of RocketNow'}>
          <LazyLoad>
            <img className="visible" src={stripe} alt="stripe logo" />
          </LazyLoad>
          <LazyLoad>
            <img className="visible" src={shippo} alt="shippo logo" />
          </LazyLoad>
          <LazyLoad>
            <img className="visible" src={algolia} alt="algolia logo" />
          </LazyLoad>
          <LazyLoad>
            <img className="visible" src={mailChimp} alt="mailchimp logo" />
          </LazyLoad>
          <LazyLoad>
            <img className="visible" src={messenger} style={{ width: '140px', height: '40px' }} alt="messenger logo" />
          </LazyLoad>
        </a>
      </div>
      <div />
      <div />
      <section>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2">
              <div className="p-5">
                <LazyLoad>
                  <img className="rounded-circle img-fluid" src={choice} alt="choice balloons" />
                </LazyLoad>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="p-5">
                <h2 className="display-4">For great choice appreciators</h2>
                <p style={fontSize}>
                  While most platforms limit their selection to one or two categories, we offer goods in 6 categories.
                </p>
                <p style={fontSize}>
                  Looking for a book to entertain? We got you covered! Looking for a nice notebook for your friend's
                  birthday? Same story.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="article-list" id="grey">
        <div className="container">
          <div className="intro" />
          <div className="row articles">
            <div className="col-lg-3">
              <h2 className="text-center">Shop by category</h2>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-3 item" style={{ paddingBottom: '30px', paddingTop: '40px' }}>
              <h3 className="name" style={{ fontSize: '20px', fontFamily: 'Lato' }}>
                Fashion
              </h3>
              <a href="/c/fashion" aria-label={'View our fashion selection'}>
                <LazyLoad>
                  <img className="img-fluid" src={fashion} alt="fashion category" />
                </LazyLoad>
              </a>
              <h3 className="name" style={{ fontSize: '20px', fontFamily: 'Lato' }}>
                Health &amp; Beauty
              </h3>
              <a href="/c/health_and_beauty" aria-label={'View our health & beauty selection'}>
                <LazyLoad>
                  <img className="img-fluid" src={healthAndBeauty} alt="health and beauty category" />
                </LazyLoad>
              </a>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-3 item" style={{ paddingBottom: '30px', paddingTop: '40px' }}>
              <h3 className="name" style={{ fontSize: '20px', fontFamily: 'Lato' }}>
                Subscriptions
              </h3>
              <a href="/c/subscriptions" aria-label={'View our subscriptions selection'}>
                <LazyLoad>
                  <img className="img-fluid" src={subscription} alt="subscriptions category" />
                </LazyLoad>
              </a>
              <h3 className="name" style={{ fontSize: '20px', fontFamily: 'Lato' }}>
                Digital Goods
              </h3>

              <a href="/c/digital" aria-label={'View our digital goods selection'}>
                <LazyLoad>
                  <img className="img-fluid" src={digitalGoods} alt="digital goods category" />
                </LazyLoad>
              </a>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-3 item" style={{ paddingBottom: '30px', paddingTop: '40px' }}>
              <h3 className="name" style={{ fontSize: '20px', fontFamily: 'Lato' }}>
                Entertainment
              </h3>

              <a href="/c/entertainment" aria-label={'View our entertainment selection'}>
                <LazyLoad>
                  <img className="img-fluid" src={entertainment} alt="entertainment category" />
                </LazyLoad>
              </a>
              <h3 className="name" style={{ fontSize: '20px', fontFamily: 'Lato' }}>
                Electronics
              </h3>
              <a href="/c/electronics" aria-label={'View our electronics selection'}>
                <LazyLoad>
                  <img className="img-fluid" src={electronics} alt="electronics category" />
                </LazyLoad>
              </a>
            </div>
          </div>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-1">
              <div className="p-5">
                <LazyLoad>
                  <img className="rounded-circle img-fluid" src={delivery} alt="accurate delivery" />
                </LazyLoad>
              </div>
            </div>
            <div className="col-lg-6 order-lg-2">
              <div className="p-5">
                <h2 className="display-4">For accurate delivery lovers</h2>
                <br />
                <p style={fontSize}>
                  Our cutting edge technology and close relationships with the merchants help us accurately predict when
                  your orders arrive.
                </p>
                <p style={fontSize}>
                  This gives you peace of mind and frees up your time.Spend it with your loved ones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="features-boxed" id="grey">
        <div className="container" id="grey">
          <div className="intro">
            <h2 className="text-center">How to use RocketNow</h2>
          </div>
          <div className="row justify-content-center features">
            <div className="col-sm-6 col-md-5 col-lg-4 item">
              <div className="box">
                <i className="far fa-edit icon" id="howToIcon" />
                <h3 className="name">1. Signup for free.</h3>
                <p className="description">
                  Sign up &nbsp;online for free. &nbsp;All you need is an email address, or a Google or Facebook
                  account.&nbsp;
                </p>
              </div>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
              <div className="box">
                <i className="fas fa-search icon" id="howToIcon" />
                <h3 className="name">2. Search for Products</h3>
                <p className="description">
                  Tell us what are you looking for. Search for a specific title or a general term. You can also browse
                  through our categories.
                </p>
              </div>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
              <div className="box">
                <i className="fas fa-truck icon" id="howToIcon" />
                <h3 className="name">3. Choose a Shipping Option</h3>
                <p className="description">
                  We ship your order to a parcel location or a home address. We're also providing you with an estimated
                  arrival time.
                </p>
              </div>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
              <div className="box">
                <i className="fab fa-stripe icon" id="howToIcon" />
                <h3 className="name">4. Enter Payment Details</h3>
                <p className="description">
                  We accept all major credit and debit cards. Your payment is securely processed by Stripe.{' '}
                </p>
              </div>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
              <div className="box">
                <i className="fa fa-barcode icon" id="howToIcon" />
                <h3 className="name">5. Track your Order</h3>
                <p className="description">
                  You can track your order in your account, and we'll tell when it's shipped. We're also giving you the
                  estimated arrival time.
                </p>
              </div>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
              <div className="box">
                <i className="far fa-heart icon" id="howToIcon" />
                <h3 className="name">6. &nbsp;Spread the Love</h3>
                <p className="description">
                  That's it. Pick up your order from your shipping location. &nbsp;Enjoy it and &nbsp;spread the
                  love.&nbsp;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2">
              <div className="p-5">
                <LazyLoad>
                  <img className="rounded-circle img-fluid" src={support} alt="RocketNow support" />
                </LazyLoad>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="p-5">
                <h2 className="display-4">Support all the way!</h2>
                <br />
                <p style={fontSize}>We're there for you at every step of the way.</p>
                <p style={fontSize}>
                  If you need help with your orders or you have an awesome idea on how to make the service better for
                  everyone there's always a lovely person whom you can chat with.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="highlight-clean" id="grey">
        <div className="container" id="grey">
          <div className="intro">
            <h2 className="text-center" style={{ fontSize: '30px', fontFamily: 'Lato' }}>
              Numerous goods are waiting for you
              <br />
              <br />
              <a
                className="btn btn-primary btn-block btn-lg"
                role="button"
                aria-label={'Sign up with RocketNow'}
                href="/signup"
              >
                Sign up for free
              </a>
            </h2>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
});
