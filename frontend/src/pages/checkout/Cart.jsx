import React, {Fragment} from "react";
import {Skeleton, Checkbox} from 'antd';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {RemoveFromCart} from '../../buttons/ModifyCart';
import Footer from "../navbarAndFooter/Footer.jsx";
import Navbar from "../navbarAndFooter/Navbar.jsx";
import {isRegularUserLoggedIn} from "../../components/Authentication";
import {ParcelDeliveryLocationForm, GoToPayment, AddressForm} from "./Checkout";
import axios from 'axios';
import {print} from "graphql";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {formatTimeStamp} from "../../components/RelativeTimestamp";
import {Helmet} from "react-helmet";


const NUMBEROFGOODS_INCART_AND_SUBTOTAL_QUERY = gql`
    query numberOfGoodsInCartAndSubtotalAndTax($jwt_token: String!) {
        numberOfGoodsInCartAndSubtotalAndTax(jwt_token: $jwt_token)
    }
`;
const SHOPPINGCART_QUERY = gql`
    query individualCart($jwt_token: String!) {
        individualCart(jwt_token: $jwt_token) {
            goods {
                quantity
                good {
                    _id
                    nr
                    title
                    quantity
                    current_price
                    currency
                    main_image_cloudinary_secure_url
                    seller {
                        businessname
                        nr
                    }
                }
            }
        }
    }
`;

const currency_display_dictionary = {
    "EUR": "€",
    "USD": "$",
    "RUB": "₽",
    "GBP": "£",
    "CNY": "¥",
    "JPY": "¥",
    "CHF": "Fr"
};


function cartItem(good) {
    if (!good) {
        return;
    }
    const id = good.good._id;
    const quantity = good.quantity;
    const title = good.good.title;
    let price = good.good.current_price;
    const currency = currency_display_dictionary[good.good.currency];
    const mainImage = good.good.main_image_cloudinary_secure_url;
    const good_url = "/goods/" + good.good.nr + "/" + title;
    const sellerName = good.good.seller.businessname;
    const jwt_token = (isRegularUserLoggedIn()) ? sessionStorage.getItem("jwtToken") : sessionStorage.getItem("temporary_user_id");

    return (
        <tr>
            <td className="border-0 align-left">
                <LazyLoadImage
                    alt={title}
                    src={mainImage}
                    width="70"
                />
            </td>
            <td className="border-0 align-left"><a target="_blank" href={good_url}>{title}</a></td>
            <td className="border-0 align-middle">{quantity}</td>
            <td className="border-0 align-middle">{currency}{price}</td>
            <td className="border-0 align-middle">
                <RemoveFromCart
                    title={title}
                    quantity={-quantity}
                    good_id={id}
                    cart_identifier={jwt_token}
                />
            </td>
        </tr>
    );
}


export default class ShoppingCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shippingOption: 'Parcel delivery',
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
            ShippingEstimatedDeliveryTime: '',
            orderSubtotal: undefined,
            shippingTaxCost: 0,
            subTotalTaxCost: 0
        };
        this.shippingOptionSelected = this.shippingOptionSelected.bind(this);
        this.renderDisplayedLocation = this.renderDisplayedLocation.bind(this);
        this.DeliveryEstimateSelected = this.DeliveryEstimateSelected.bind(this);
        this.ShippingCostSelected = this.ShippingCostSelected.bind(this);

    }


    shippingOptionSelected(checkedValues) {
        this.setState({
            shippingOption: checkedValues[0],
            shippingTaxCost: 0,
        });
    }

    renderDisplayedLocation() {
        const {shippingOption, ParcelDeliveryLocationName, ShippingAddressLine1, ShippingAddressLine2, ShippingCity, ShippingRegion, ShippingZip, ShippingCountry} = this.state;
        if (shippingOption === "Parcel delivery") {
            return (ParcelDeliveryLocationName);
        }
        const addressLine = ShippingAddressLine1 + ((ShippingAddressLine2) ? "-" + ShippingAddressLine2 : '');
        const cityLine = ShippingZip + ", " + ShippingCity;
        const regionLine = ShippingRegion + ", " + ShippingCountry;

        if (ShippingAddressLine1 && ShippingCity && ShippingCountry) {
            return (
                <table className="table">
                    <tbody>
                    <tr>
                        <td>Address: {addressLine}</td>
                    </tr>
                    <tr>
                        <td>City: {cityLine}</td>
                    </tr>
                    <tr>
                        <td>Region: {regionLine}</td>
                    </tr>
                    </tbody>
                </table>
            );
        }
        return "";

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
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                return null;
            }
            return res.data;
        }).then(resData => {
            const orderSubtotal = resData.data.numberOfGoodsInCartAndSubtotalAndTax[1];
            const tax = resData.data.numberOfGoodsInCartAndSubtotalAndTax[2];

            this.setState({
                orderSubtotal: orderSubtotal,
                subTotalTaxCost: tax
            });
        })
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
            ShippingEstimatedDeliveryTime
        } = this.state;

        const jwt_token = (isRegularUserLoggedIn()) ? sessionStorage.getItem("jwtToken") : sessionStorage.getItem("temporary_user_id");
        const shipping = (!ShippingCost) ? '' : ShippingCost;
        const tax = (!subTotalTaxCost || !shippingTaxCost) ? '' : Math.round(100 * (subTotalTaxCost + shippingTaxCost)) / 100;
        const subtotal = (!orderSubtotal) ? '' : orderSubtotal;
        const total = (!shipping || !tax || !subtotal) ? '' : Math.round(100 * (shipping + tax + subtotal)) / 100;
        const currency = (!shipping || !tax || !subtotal) ? '' : currency_display_dictionary[ShippingCurrency];

        return (
            <div>
                <Navbar/>
                <Helmet>
                    <title>Shoppingcart</title>
                </Helmet>
                <div className="px-4 px-lg-0" style={{
                    background: "linear-gradient(to right, #ffffff, #1E96FF)",
                    minHeight: "100vh"
                }}>
                    <br/> <br/> <br/>
                    <div className="pb-5">
                        <div className="container">
                            <div className="row">
                                <div style={{maxWidth: "100%"}}
                                     className="col-lg-12 p-5 bg-white rounded shadow-sm mb-5">
                                    <div className="table-responsive-md">
                                        <table className="table">
                                            <thead>
                                            <tr>
                                                <th scope="col" className="border-0 bg-light">
                                                    <div className="p-2 px-3 text-uppercase">Product</div>
                                                </th>
                                                <th scope="col" className="border-0 bg-light">
                                                    <div className="p-2 px-3 text-uppercase">Title</div>
                                                </th>
                                                <th scope="col" className="border-0 bg-light">
                                                    <div className="p-2 px-3 text-uppercase">Quantity</div>
                                                </th>
                                                <th scope="col" className="border-0 bg-light">
                                                    <div className="p-2 px-3 text-uppercase">Price</div>
                                                </th>
                                                <th scope="col" className="border-0 bg-light">
                                                    <div className="py-2 text-uppercase">Remove</div>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <Fragment>
                                                < Query query={SHOPPINGCART_QUERY} variables={{jwt_token}}>
                                                    {({data, loading, error}) => {
                                                        if (loading) return <Skeleton loading={true} active avatar/>;
                                                        if (error) return "";
                                                        if (data) {
                                                            if (data.individualCart.goods) {
                                                                return data.individualCart.goods.map(cartItem);
                                                            }
                                                            return "";
                                                        }
                                                    }
                                                    }
                                                </Query>
                                            </Fragment>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="row py-5 p-4 bg-white rounded shadow-sm">
                                <div className="col-lg-6">
                                    <div
                                        className="bg-light rounded-pill px-4 py-3 text-uppercase font-weight-bold"> Select
                                        your shipping option
                                    </div>
                                    <br/>
                                    <div style={{marginLeft: "10px"}}>
                                        <Checkbox.Group options={this.state.shippingOptions}
                                                        value={this.state.shippingOption}
                                                        defaultValue={['Parcel delivery']}
                                                        onChange={this.shippingOptionSelected}/>
                                    </div>
                                    <br/>
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
                                    <br/>
                                    <br/>
                                    <br/>
                                </div>
                                <div className="col-lg-6">
                                    <div
                                        className="bg-light rounded-pill px-4 py-3 text-uppercase font-weight-bold">Order
                                        summary
                                    </div>
                                    <div className="p-4">
                                        <p className="font-italic mb-4">
                                            Shipping to:{ShippingName}
                                            <br/>
                                            Location: {this.renderDisplayedLocation()}
                                            <br/>
                                            Estimated arrival time: {formatTimeStamp(ShippingEstimatedDeliveryTime)}</p>
                                        <ul className="list-unstyled mb-4">
                                            <li className="d-flex justify-content-between py-3 border-bottom">
                                                <strong
                                                    className="text-muted">
                                                    Order
                                                    Subtotal </strong><strong>{(!subtotal) ? '' : currency_display_dictionary[ShippingCurrency]}{subtotal}</strong>
                                            </li>
                                            <li className="d-flex justify-content-between py-3 border-bottom">
                                                <strong
                                                    className="text-muted">
                                                    Shipping and
                                                    handling</strong><strong>{(!shipping) ? '' : currency_display_dictionary[ShippingCurrency]}{shipping}</strong>
                                            </li>
                                            <li className="d-flex justify-content-between py-3 border-bottom">
                                                <strong
                                                    className="text-muted">
                                                    Tax</strong><strong>{(!tax) ? '' : currency_display_dictionary[ShippingCurrency]}{tax}</strong>
                                            </li>
                                            <li className="d-flex justify-content-between py-3 border-bottom">
                                                <strong className="text-muted">Total</strong>
                                                <h5 className="font-weight-bold">{currency}{total}</h5>
                                            </li>
                                        </ul>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}