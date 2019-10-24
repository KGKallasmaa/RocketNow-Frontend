import React from "react";
import {Skeleton, Checkbox} from 'antd';
import Footer from "../../components/footer.jsx";
import {Navbar} from "../../components/navbar.jsx";
import {isRegularUserLoggedIn} from "../../components/authentication";
import {GoToPayment} from "./checkout";
import {formatTimeStamp} from "../../components/relativeTimestamp";
import {Helmet} from "react-helmet";
import {NUMBEROFGOODS_INCART_AND_SUBTOTAL_QUERY} from "../../graphql/numberOfGoods_inCart_And_Subtotal_QUERY";
import {SHOPPINGCART_QUERY} from "../../graphql/shoppingCart_QUERY";
import "../../assets/css/cart.min.css";
import {EditCartGood} from "../../components/modifyCart";
import {currency_symbol_converter} from "../../components/currency_and_symbol";
import {fetchData} from "../../common/fetcher";
import {ParcelDeliveryLocationForm} from "./components/parcelDeliveryLocation";
import {AddressForm} from "./components/addressForm";


const script_url = "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_PLACES_API_KEY + "&libraries=places";

function renderLoadingCartCartItem() {
    return (
        <li>
            <div className="pl-thumb">
                <Skeleton shape="square" avatar title={false}/>
            </div>
            <Skeleton paragraph={2}/>
        </li>
    );
}


function renderCartItem(good) {
    if (!good) {
        alert("This should not happen!!!!");
        return;
    }
    return (
        <EditCartGood good={good}/>
    );
}

export default class ShoppingCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shippingOption: 'Address delivery',
            shippingOptions: ['Parcel delivery', 'Address delivery'],
            addressFormUpdatedWithGoogle: false,
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
            componentDidMount: false,
        };
        this.shippingOptionSelected = this.shippingOptionSelected.bind(this);
        this.DeliveryEstimateSelected = this.DeliveryEstimateSelected.bind(this);
        this.ShippingCostSelected = this.ShippingCostSelected.bind(this);
        this.SearchedWithGoogle = this.SearchedWithGoogle.bind(this);
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
        console.log("I recuuested an update")
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

    SearchedWithGoogle(Action) {
        this.setState({
            addressFormUpdatedWithGoogle: Action,
        });
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
    //    alert(JSON.stringify(nextState));
        if (nextState.shippingOption === "Parcel delivery"){
            if (nextState.ParcelDeliveryLocation !== this.state.ParcelDeliveryLocation){
                return true;
            }
        }
        else if (nextState.shippingOption === "Address delivery"){
            console.log(nextState)
            if (nextState.ParcelDeliveryLocation !== this.state.ShippingAddressLine1){
                return true;
            }

        }
        if (nextState.ShippingEstimatedDeliveryTime !== this.state.ShippingEstimatedDeliveryTime){
            return true;
        }

        if (nextState.orderSubtotal === undefined) {
            return false;
        }
        if (nextState.TimezoneOffset_M !== undefined) {
            return false;
        }
        return nextState.addressFormUpdatedWithGoogle !== true;

    }


    componentDidUpdate(prevProps, prevState) {
        console.log("CART COMPONENT componentDidUpdate")
    }


    async componentDidMount() {
        let orderSubtotal = undefined;
        let subTotalTaxCost = undefined;
        let shoppingcartGoods = "noResults";

        const variables = {jwt_token: (isRegularUserLoggedIn()) ? sessionStorage.getItem("jwtToken") : sessionStorage.getItem("temporary_user_id")};

        let fetchSubtotalAndTax = fetchData(variables, NUMBEROFGOODS_INCART_AND_SUBTOTAL_QUERY);
        let fetchCartGoods = fetchData(variables, SHOPPINGCART_QUERY);

        let subtotalAndTax = await fetchSubtotalAndTax;

        if (subtotalAndTax !== null) {
            orderSubtotal = subtotalAndTax.numberOfGoodsInCartAndSubtotalAndTax[1];
            subTotalTaxCost = subtotalAndTax.numberOfGoodsInCartAndSubtotalAndTax[2];
        }
        let cartGoods = await fetchCartGoods;
        if (cartGoods !== null) {
            if (cartGoods.individualCart.goods.length > 0) {
                shoppingcartGoods = cartGoods.individualCart.goods
            }
        }
        this.setState({
            componentDidMount: true,
            orderSubtotal: orderSubtotal,
            subTotalTaxCost: subTotalTaxCost,
            shoppingcartGoods: shoppingcartGoods
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
            componentDidMount,
            addressFormUpdatedWithGoogle,
            ParcelDeliveryLocationName
        } = this.state;

        const jwt_token = (isRegularUserLoggedIn()) ? sessionStorage.getItem("jwtToken") : sessionStorage.getItem("temporary_user_id");
        const shipping = (!ShippingCost) ? '' : ShippingCost;
        const tax = (!subTotalTaxCost || !shippingTaxCost) ? '' : Math.round(100 * (subTotalTaxCost + shippingTaxCost)) / 100;
        const subtotal = (!orderSubtotal) ? '' : orderSubtotal;
        const total = (!shipping || !tax || !subtotal) ? '' : Math.round(100 * (shipping + tax + subtotal)) / 100;
        const currency = (!shipping || !tax || !subtotal) ? '' : currency_symbol_converter[ShippingCurrency];

        const cannonialUrl = process.env.REACT_APP_CLIENT_URL + "/cart";
        return (
            <div>
                <Navbar/>
                <Helmet>
                    <title>Shopping cart</title>
                    <link rel="canonial" href={cannonialUrl}/>
                    <meta name="description" content="View your shopping cart at RocketNow"/>
                </Helmet>
                <section className="checkout-section spad">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 order-2 order-lg-1">
                                <form className="checkout-form">
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

                                    {(this.state.shippingOption !== 'Parcel delivery') ? <p/> :
                                        <ParcelDeliveryLocationForm
                                            ShippingName={ShippingName}
                                            ShippingCurrency={ShippingCurrency}
                                            ParcelDeliveryLocationCountry={this.state.ParcelDeliveryLocationCountry}
                                            ParcelDeliveryLocation={ParcelDeliveryLocationName}
                                            DeliveryEstimateSelected={this.DeliveryEstimateSelected}
                                            ShippingCostSelected={this.ShippingCostSelected}
                                            disabled={this.state.shippingOption !== 'Parcel delivery'}/>
                                    }
                                    <script src={script_url}/>

                                    {(this.state.shippingOption !== 'Address delivery') ? <p/> :
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
                                        SearchedWithGoogle={this.SearchedWithGoogle}
                                        hasSearchedWithGoogle={addressFormUpdatedWithGoogle}
                                        disabled={this.state.shippingOption !== 'Address delivery'}
                                        />
                                    }
                                    <div
                                        className="cf-title"> {(ShippingEstimatedDeliveryTime !== undefined) ? "Delivery details" : "Select shipping option for delivery details"}</div>
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
                                </form>

                                {(ShippingCity !== undefined || ParcelDeliveryLocationName !== undefined) ? <GoToPayment
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
                                    /> :
                                    <p/>}
                            </div>
                            <div className="col-lg-4 order-1 order-lg-2">
                                <div className="checkout-cart">
                                    <h3>Your Cart</h3>
                                    <ul className="product-list">
                                        {(componentDidMount === false && shoppingcartGoods !== "noResults") ? renderLoadingCartCartItem() : <p/>}
                                        {(shoppingcartGoods !== undefined && shoppingcartGoods !== "noResults") ? shoppingcartGoods.map(renderCartItem) :
                                            <p/>}
                                    </ul>
                                    <ul className="price-list">
                                        <li>Subtotal<span>{currency}{subtotal}</span></li>
                                        <li>Shipping<span>{currency}{shipping}</span></li>
                                        <li>Taxes<span>{currency}{tax}</span></li>
                                        <li className="total">Total<span>{currency}{total}</span></li>
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