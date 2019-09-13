import React from "react";
import {Skeleton, Checkbox} from 'antd';
import Footer from "../../components/footer.jsx";
import {Navbar} from "../../components/navbar.jsx";
import {isRegularUserLoggedIn} from "../../components/authentication";
import {ParcelDeliveryLocationForm, GoToPayment, AddressForm} from "./checkout";
import axios from 'axios';
import {print} from "graphql";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {formatTimeStamp} from "../../components/relativeTimestamp";
import {Helmet} from "react-helmet";
import {NUMBEROFGOODS_INCART_AND_SUBTOTAL_QUERY} from "../../graphql/numberOfGoods_inCart_And_Subtotal_QUERY";
import {SHOPPINGCART_QUERY} from "../../graphql/shoppingCart_QUERY";
import "../../assets/css/cart.min.css";


const currency_display_dictionary = {
    'EUR': '€',
    'USD': '$',
    'RUB': '₽',
    'GBP': '£',
    'CNY': '¥',
    'JPY': '¥',
    'CHF': 'Fr'
};


function rederCartItem(good) {
    if (!good) {
        return;
    }
    const title = good.good.title;
    const quantity = good.quantity;
    const subtotalPrice = good.good.current_price;
    const currency = currency_display_dictionary[good.good.currency];
    const mainImage = good.good.main_image_cloudinary_secure_url;

    return (
        <li>
            <div className="pl-thumb">
                <LazyLoadImage
                    alt={title}
                    src={mainImage}
                />
            </div>
            <h6>{title}</h6>
            <p>{quantity} x {currency}{subtotalPrice}</p>
        </li>
    );
}

function rederLoadingCartCartItem(componentDidMount) {
    if (componentDidMount) {
        return;
    }
    return (
        <li>
            <div className="pl-thumb">
                <Skeleton shape="square" avatar title={false}/>
            </div>
            <Skeleton paragraph={2}/>
        </li>
    );
}


export default class ShoppingCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shippingOption: 'Address delivery',
            shippingOptions: ['Parcel delivery', 'Address delivery'],
            sessionId: '',
            goingToPayment: false,
            goingToPaymentButtonClicked: false,
            ShippingCurrencySymbol: "€",
            ShippingName: sessionStorage.getItem("regularUserFullName"),
            ShippingAddressLine1: undefined,
            ShippingAddressLine2: undefined,
            ShippingCity: undefined,
            ShippingRegion: undefined,
            ShippingZip: undefined,
            ShippingCountry: undefined,
            TimezoneOffset_M: undefined,
            ShippingMethod: undefined,
            ShippingCost: undefined,
            ParcelDeliveryLocation: undefined,
            ParcelDeliveryLocationName: undefined,
            ParcelDeliveryLocationCountry: undefined,
            ShippingCurrency: "EUR",
            ShippingValuesAreValid: false,
            ShippingEstimatedDeliveryTime: undefined,
            orderSubtotal: undefined,
            shippingTaxCost: 0,
            subTotalTaxCost: 0,
            componentDidMount: false
        };
        this.shippingOptionSelected = this.shippingOptionSelected.bind(this);
        this.DeliveryEstimateSelected = this.DeliveryEstimateSelected.bind(this);
        this.ShippingCostSelected = this.ShippingCostSelected.bind(this);
    }

    shippingOptionSelected(event) {
        this.setState({
            shippingOption: event.target.value,
            shippingTaxCost: 0,
        });
    }

    ShippingCostSelected(ShippingName,
                         ShippingAddressLine1,
                         ShippingAddressLine2,
                         ShippingCity,
                         ShippingRegion,
                         ShippingZip,
                         ShippingCountry,
                         TimezoneOffset_M,
                         ShippingValuesAreValid,
                         ShippingMethod,
                         ShippingCost,
                         ParcelDeliveryLocation,
                         ParcelDeliveryLocationName,
                         ParcelDeliveryLocationCountry,
    ) {
        //In Estonia for shippping VAT is 20%
        const VAT = 0.2;
        const shippingCostWithoutTax = Math.round(100 * (ShippingCost / (1 + VAT))) / 100;
        this.setState({
            ShippingName: ShippingName,
            ShippingAddressLine1: ShippingAddressLine1,
            ShippingAddressLine2: ShippingAddressLine2,
            ShippingCity: ShippingCity,
            ShippingRegion: ShippingRegion,
            ShippingZip: ShippingZip,
            ShippingCountry: ShippingCountry,
            TimezoneOffset_M: TimezoneOffset_M,
            ShippingValuesAreValid: ShippingValuesAreValid,
            ShippingMethod: ShippingMethod,
            ShippingCost: shippingCostWithoutTax,
            shippingTaxCost: ShippingCost - shippingCostWithoutTax,
            ParcelDeliveryLocation: ParcelDeliveryLocation,
            ParcelDeliveryLocationName: ParcelDeliveryLocationName,
            ParcelDeliveryLocationCountry: ParcelDeliveryLocationCountry,
        });
    };

    DeliveryEstimateSelected(DeliveryEstimate) {
        this.setState({
            ShippingEstimatedDeliveryTime: DeliveryEstimate,
        });
    };

    async componentDidMount() {
        const jwt_token = (isRegularUserLoggedIn()) ? sessionStorage.getItem("jwtToken") : sessionStorage.getItem("temporary_user_id");
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(NUMBEROFGOODS_INCART_AND_SUBTOTAL_QUERY),
            variables: {
                jwt_token: jwt_token
            }
        }).then(resData => {
            this.setState({
                orderSubtotal: resData.data.data.numberOfGoodsInCartAndSubtotalAndTax[1],
                subTotalTaxCost: resData.data.data.numberOfGoodsInCartAndSubtotalAndTax[2]
            });
        });

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(SHOPPINGCART_QUERY),
            variables: {
                jwt_token: jwt_token
            }
        }).then(resData => {
            if (resData.data.data.individualCart) {
                if (resData.data.data.individualCart.goods.length > 0) {
                    this.setState({
                        shoppingcartGoods: resData.data.data.individualCart.goods
                    });
                }
            } else {
                this.setState({
                    shoppingcartGoods: "noResults"
                });
            }

        });
        this.setState({
            componentDidMount: true
        });

    }

    render() {
        let {
            ShippingName,
            ShippingAddressLine1,
            ShippingAddressLine2,
            ShippingCity,
            ShippingRegion,
            ShippingZip,
            ShippingCountry,
            TimezoneOffset_M,
            ShippingMethod,
            ShippingCost,
            ParcelDeliveryLocation,
            ShippingCurrency,
            subTotalTaxCost,
            shippingTaxCost,
            orderSubtotal,
            ShippingValuesAreValid,
            ShippingEstimatedDeliveryTime,
            shoppingcartGoods,
            componentDidMount
        } = this.state;

        const jwt_token = (isRegularUserLoggedIn()) ? sessionStorage.getItem("jwtToken") : sessionStorage.getItem("temporary_user_id");
        const shipping = (!ShippingCost) ? '' : ShippingCost;
        const tax = (!subTotalTaxCost || !shippingTaxCost) ? '' : Math.round(100 * (subTotalTaxCost + shippingTaxCost)) / 100;
        const subtotal = (!orderSubtotal) ? '' : orderSubtotal;
        const total = (!shipping || !tax || !subtotal) ? '' : Math.round(100 * (shipping + tax + subtotal)) / 100;
        const currency = (!shipping || !tax || !subtotal) ? '' : currency_display_dictionary[ShippingCurrency];

        const cannonialUrl = process.env.REACT_APP_CLIENT_URL + "/cart";
        return (
            <div>
                <Navbar/>
                <Helmet>
                    <title>Shopping cart</title>
                    <link rel="canonial" href={cannonialUrl}/>
                    <meta name="description" content="View your shopping cart at RocketNow"/>
                </Helmet>
                <section class="checkout-section spad">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-8 order-2 order-lg-1">
                                <form class="checkout-form">
                                    <div className="cf-title">Shipping type</div>
                                    <div className="row shipping-btns">
                                        <div className="col-6">
                                            <Checkbox value={"Parcel delivery"}
                                                      checked={this.state.shippingOption === 'Parcel delivery'}
                                                      onChange={this.shippingOptionSelected}>Parcel delivery
                                            </Checkbox>
                                        </div>
                                        <br/>
                                        <div className="col-6">
                                            <Checkbox value={"Address delivery"}
                                                      checked={this.state.shippingOption === 'Address delivery'}
                                                      onChange={this.shippingOptionSelected}>Address delivery
                                            </Checkbox>
                                        </div>
                                    </div>
                                    <ParcelDeliveryLocationForm
                                        ShippingName={ShippingName}
                                        ShippingCurrency={ShippingCurrency}
                                        ParcelDeliveryLocationCountry={this.state.ParcelDeliveryLocationCountry}
                                        ParcelDeliveryLocation={this.state.ParcelDeliveryLocationName}
                                        DeliveryEstimateSelected={this.DeliveryEstimateSelected}
                                        ShippingCostSelected={this.ShippingCostSelected}
                                        disabled={this.state.shippingOption !== 'Parcel delivery'}/>

                                    <AddressForm
                                        ShippingName={ShippingName}
                                        ShippingAddressLine1={ShippingAddressLine1}
                                        ShippingAddressLine2={ShippingAddressLine2}
                                        ShippingCity={ShippingCity}
                                        ShippingRegion={ShippingRegion}
                                        ShippingZip={ShippingZip}
                                        ShippingCountry={ShippingCountry}
                                        ShippingCurrency={ShippingCurrency}
                                        DeliveryEstimateSelected={this.DeliveryEstimateSelected}
                                        ShippingCostSelected={this.ShippingCostSelected}
                                        disabled={this.state.shippingOption === 'Parcel delivery'}/>

                                    <div
                                        className="cf-title"> {(ShippingEstimatedDeliveryTime !== undefined) ? "Delivery details" : "Select shippingoption for delivery details"}</div>
                                    <div className="row shipping-btns">
                                        <div className="col-6">
                                            <h4> {(ShippingEstimatedDeliveryTime !== undefined) ? "Estimated arrival time" :
                                                <p/>}</h4>
                                        </div>
                                        <div className="col-6">
                                            <h4>
                                                <b>{(ShippingEstimatedDeliveryTime !== undefined) ? formatTimeStamp(ShippingEstimatedDeliveryTime) :
                                                    <p/>} </b></h4>
                                        </div>
                                    </div>
                                    <GoToPayment
                                        jwt_token={jwt_token}
                                        ShippingName={ShippingName}
                                        ShippingAddressLine1={ShippingAddressLine1}
                                        ShippingAddressLine2={ShippingAddressLine2}
                                        ShippingCity={ShippingCity}
                                        ShippingRegion={ShippingRegion}
                                        ShippingZip={ShippingZip}
                                        ShippingCountry={ShippingCountry}
                                        TimezoneOffset_M={TimezoneOffset_M}
                                        ShippingMethod={ShippingMethod}
                                        ShippingCost={ShippingCost + shippingTaxCost}
                                        taxCost={tax - subTotalTaxCost}
                                        ParcelDeliveryLocation={ParcelDeliveryLocation}
                                        ShippingCurrency={ShippingCurrency}
                                        deliveryEstimate_UTC={ShippingEstimatedDeliveryTime}
                                        orderSubtotal={orderSubtotal}
                                        disabled={!ShippingValuesAreValid}
                                    />
                                </form>
                            </div>
                            <div class="col-lg-4 order-1 order-lg-2">
                                <div class="checkout-cart">
                                    <h3>Your Cart</h3>
                                    <ul class="product-list">
                                        {(componentDidMount === false && shoppingcartGoods !== "noResults") ? rederLoadingCartCartItem(componentDidMount) :
                                            <p/>}
                                        {(shoppingcartGoods !== undefined && shoppingcartGoods !== "noResults") ? shoppingcartGoods.map(rederCartItem) :
                                            <p/>}
                                    </ul>
                                    <ul class="price-list">
                                        <li>Subtotal<span>{currency}{subtotal}</span></li>
                                        <li>Shipping<span>{currency}{shipping}</span></li>
                                        <li>Taxes<span>{currency}{tax}</span></li>
                                        <li class="total">Total<span>{currency}{total}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer/>
            </div>
        );
    }
}