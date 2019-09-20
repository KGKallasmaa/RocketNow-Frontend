import axios from 'axios';
import {print} from "graphql";
import Emoji from "react-emoji-render";
import Script from 'react-load-script';

import React, {Component} from "react";
import {Form, message, Icon, Input, Select, Skeleton} from "antd";
import {isRegularUserLoggedIn} from "../../components/authentication";
import {getEmoji} from "../../components/emoji";
import {CHECKOUT_MUTATION} from "../../graphql/checkout_MUTATION";
import {ShippingCost_QUERY} from "../../graphql/shippingCost_QUERY";
import {DeliveryEstimate_QUERY} from "../../graphql/deliveryEstimate_QUERY";
import {ShippingLocations_QUERY} from "../../graphql/parcelLocations_QUERY";


const Search = Input.Search;
const loadingIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;
const {Option, OptGroup} = Select;


export class AddressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            route: '',
            ShippingName: this.props.ShippingName,
            street_number: '',
            formErrors: {
                ShippingName: '',
                ShippingRoute: '',
                ShippingAddressLine1: '',
                ShippingAddressLine2: '',
                ShippingCity: '',
                ShippingRegion: '',
                ShippingZip: '',
                ShippingCountry: ''
            },
            formValidity: {
                ShippingName: false,
                ShippingAddressLine1: false,
                ShippingAddressLine2: true,
                ShippingCity: false,
                ShippingRegion: false,
                ShippingZip: false,
                ShippingCountry: false
            },
            hasSearchedWithGoogle: false,
            canSubmit: false,
            SavingAddressInfo: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAddressSubmit = this.handleAddressSubmit.bind(this);
        this.handleScriptLoad = this.handleScriptLoad.bind(this);
        this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
        this.validateField = this.validateField.bind(this);
    }


    handleAddressSubmit = e => {
        e.preventDefault();
        this.setState({SavingAddressInfo: true});

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(ShippingCost_QUERY),
            variables: {
                jwt_token: sessionStorage.getItem("jwtToken"),
                TimezoneOffset_M: new Date().getTimezoneOffset(),
                ShippingCountry: this.state.ShippingCountry,
                ShippingMethod: "AddressDelivery",
                ShippingCurrency: this.props.ShippingCurrency
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed to fetch the shipping cost');
            }
            return res.data;
        }).then(resData => {
            const shippingcost = resData.data.DeliveryCost;
            axios.post(process.env.REACT_APP_SERVER_URL, {
                query: print(DeliveryEstimate_QUERY),
                variables: {
                    jwt_token: sessionStorage.getItem("jwtToken"),
                    TimezoneOffset_M: new Date().getTimezoneOffset(),
                    ShippingAddressLine1: this.state.ShippingAddressLine1,
                    ShippingAddressLine2: this.state.ShippingAddressLine2,
                    ShippingCity: this.state.ShippingCity,
                    ShippingRegion: this.state.ShippingRegion,
                    ShippingZip: this.state.ShippingZip,
                    ShippingCountry: this.state.ShippingCountry,
                    ShippingMethod: "AddressDelivery",
                    ShippingCurrency: this.props.ShippingCurrency
                }
            }).then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed to fetch the delivery estimate cost');
                }
                return res.data;
            }).then(resData => {
                const deliveryEstimate = (resData.data.DeliveryTimeEstimate === -1) ? "" : resData.data.DeliveryTimeEstimate;

                //TODO: Make the ShippingCurrency dyanmic
                this.props.ShippingCostSelected(
                    this.state.ShippingName,
                    this.state.ShippingAddressLine1,
                    this.state.ShippingAddressLine2,
                    this.state.ShippingCity,
                    this.state.ShippingRegion,
                    this.state.ShippingZip,
                    this.state.ShippingCountry,
                    new Date().getTimezoneOffset(),
                    true,
                    "AddressDelivery",
                    shippingcost,
                    undefined,
                    undefined,
                    undefined,
                );
                this.props.DeliveryEstimateSelected(
                    deliveryEstimate
                );
            })

        }).catch(err => {
            console.log(err);
        });
        this.setState({SavingAddressInfo: false});
    };


    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        }, function () {
            this.validateField(name, value)
        })
    }

    validateField(name, value) {
        const isShippingAddressLine2 = name === "ShippingAddressLine2";

        const fieldValidationErrors = this.state.formErrors;
        const validity = this.state.formValidity;


        let capitalizeFirstLetter = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        if (!isShippingAddressLine2) {

            validity[name] = value.length > 0;
            fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} is required and cannot be empty.`);

            //TODO: Advanced validation
            if (validity[name]) {
                if (name === "ShippingName") {
                    validity[name] = value.length >= 4;
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Shipping name's length should be greater than 4`);
                } else if (name === "ShippingAddressLine1") {
                    // fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                } else if (name === "ShippingCity") {
                    // fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                } else if (name === "ShippingRegion") {
                    // fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                } else if (name === "ShippingZip") {
                    // fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                } else if (name === "ShippingCountry") {
                    //  fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                }
            }
        }
        this.setState({
            formErrors: fieldValidationErrors,
            formValidity: validity,
        }, () => this.canSubmit())

    }


    canSubmit() {
        const {ShippingName, ShippingAddressLine1, ShippingAddressLine2, ShippingCity, ShippingRegion, ShippingZip, ShippingCountry} = this.state.formValidity;
        this.setState({canSubmit: ShippingName && ShippingAddressLine1 && ShippingAddressLine2 && ShippingCity && ShippingRegion && ShippingZip && ShippingCountry});
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'is-invalid');
    }

    handleScriptLoad() {
        let options = {};
        // Initialize Google Autocomplete
        /*global google*/ // To disable any eslint 'google not defined' errors
        this.autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('autocomplete'),
            options,
        );
        // Fire Event when a suggested name is selected
        this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
    }

    handlePlaceSelect() {
        let addressObject = this.autocomplete.getPlace();
        let address = addressObject.address_components;

        // console.log(address);
        if (address) {
            for (let i = 0; i < address.length; i++) {
                const element = address[i];
                const element_type = element.types[0];
                const element_value = element.long_name;

                switch (element_type) {
                    case "route":
                        this.setState({route: element_value});
                        this.validateField("ShippingName", this.state.ShippingName);
                        break;
                    case "street_number":
                        this.setState({street_number: element_value});
                        break;
                    case "sublocality_level_1":
                        this.setState({sublocality_level_1: element_value});
                        break;
                    case "locality":
                        this.setState({ShippingCity: element_value});
                        this.validateField("ShippingCity", element_value);
                        break;
                    case "administrative_area_level_1":
                        this.setState({ShippingRegion: element_value});
                        this.validateField("ShippingRegion", element_value);
                        break;
                    case "country":
                        this.setState({
                            ShippingCountry: element_value
                        });
                        this.validateField("ShippingCountry", element_value);
                        break;
                    case "postal_code":
                        this.setState({ShippingZip: element_value});
                        this.validateField("ShippingZip", element_value);
                        break;
                    default:
                        break;
                }
                this.setState({
                    ShippingAddressLine1: this.state.route + " " + this.state.street_number
                });
                this.validateField("ShippingAddressLine1", this.state.ShippingAddressLine1);
            }
        }
        this.setState({hasSearchedWithGoogle: true});
    }

    renderForm() {
        const {
            hasSearchedWithGoogle
        } = this.state;

        if (hasSearchedWithGoogle === true) {
            let {ShippingName, ShippingAddressLine1, ShippingAddressLine2, ShippingCity, ShippingRegion, ShippingZip, ShippingCountry} = this.state;
            //After the page reloads
            if (ShippingName === undefined) {
                ShippingName = this.props.ShippingName;
                ShippingAddressLine1 = this.props.ShippingAddressLine1;
                ShippingAddressLine2 = this.props.ShippingAddressLine2;
                ShippingCity = this.props.ShippingCity;
                ShippingRegion = this.props.ShippingRegion;
                ShippingZip = this.props.ShippingZip;
                ShippingCountry = this.props.ShippingCountry;
            }
            return (<div className="container">
                <Form onSubmit={this.handleAddressSubmit} className="login-form">
                    <Form.Item>
                        {<Icon type="user" style={{fontSize: '16px'}}/>}
                        <label htmlFor="ShippingName">Shipping Name</label>
                        <input
                            className={`form-control ${this.errorClass(this.state.formErrors.ShippingName)}`}
                            id="ShippingName"
                            aria-label={"Shipping name"}
                            name="ShippingName"
                            type="text"
                            placeholder="Full name"
                            value={ShippingName}
                            onChange={this.handleChange}
                        />
                        <div className="invalid-feedback">{this.state.formErrors.ShippingName}</div>
                    </Form.Item>
                    <div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Item>
                                    {<Icon type="home" style={{fontSize: '16px'}}/>}
                                    <label htmlFor="ShippingAddressLine1">Address line 1</label>
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingName)}`}
                                        id="ShippingAddressLine1"
                                        aria-label={"Shipping AddressLine One"}
                                        name="ShippingAddressLine1"
                                        type="text"
                                        placeholder="Street address"
                                        value={ShippingAddressLine1}
                                        onChange={this.handleChange}
                                    />
                                    <div
                                        className="invalid-feedback">{this.state.formErrors.ShippingAddressLine1}</div>
                                </Form.Item>
                            </div>
                            <div className="col-md-6">
                                <Form.Item>
                                    {<Icon type="number" style={{fontSize: '16px'}}/>}
                                    <label htmlFor="ShippingAddressLine2">Address line 2</label>
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingAddressLine2)}`}
                                        id="ShippingAddressLine2"
                                        aria-label={"Shipping AddressLine Two"}
                                        name="ShippingAddressLine2"
                                        type="text"
                                        placeholder="Apartment, suite, building, floor"
                                        value={ShippingAddressLine2}
                                        onChange={this.handleChange}
                                    />
                                    <div
                                        className="invalid-feedback">{this.state.formErrors.ShippingAddressLine2}</div>
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Item>
                                    {<Icon type="environment" style={{fontSize: '16px'}}/>}
                                    <label htmlFor="ShippingZip">Zip</label>
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingZip)}`}
                                        id="ShippingZip"
                                        name="ShippingZip"
                                        aria-label={"Shipping Zip Code"}
                                        type="text"
                                        placeholder="Zip/Postal code"
                                        value={ShippingZip}
                                        onChange={this.ShippingZip}
                                    />
                                    <div
                                        className="invalid-feedback">{this.state.formErrors.ShippingCity}</div>
                                </Form.Item>
                            </div>
                            <div className="col-md-6">
                                <Form.Item>
                                    {<Icon type="flag" style={{fontSize: '16px'}}/>}
                                    <label htmlFor="ShippingCity">City/Town</label>
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingCity)}`}
                                        id="ShippingCity"
                                        name="ShippingCity"
                                        aria-label={"Shipping City"}
                                        type="text"
                                        placeholder="City/Town"
                                        value={ShippingCity}
                                        onChange={this.handleChange}
                                    />
                                    <div
                                        className="invalid-feedback">{this.state.formErrors.ShippingCity}</div>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Item>
                                    {<Icon type="funnel-plot" style={{fontSize: '16px'}}/>}
                                    <label htmlFor="ShippingRegion">Region</label>
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingRegion)}`}
                                        id="ShippingRegion"
                                        name="ShippingRegion"
                                        aria-label={"Shipping Region"}
                                        type="text"
                                        placeholder="State/Province/Region"
                                        value={ShippingRegion}
                                        onChange={this.handleChange}
                                    />
                                    <div
                                        className="invalid-feedback">{this.state.formErrors.ShippingRegion}</div>
                                </Form.Item>
                            </div>
                            <div className="col-md-6">
                                <Form.Item>
                                    {<Icon type="global" style={{fontSize: '16px'}}/>}
                                    <label htmlFor="ShippingCountry">Country</label>
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingCountry)}`}
                                        id="ShippingCountry"
                                        name="ShippingCountry"
                                        aria-label={"Shipping Country"}
                                        type="text"
                                        placeholder="Country"
                                        value={ShippingCountry}
                                        onChange={this.ShippingCountry}
                                    />
                                    <div
                                        className="invalid-feedback">{this.state.formErrors.ShippingCountry}</div>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <Form.Item>
                        <button disabled={!this.state.canSubmit}
                                className="site-btn submit-order-btn" type="submit">
                            {(this.state.SavingAddressInfo) ? {loadingIcon} : "Save your shipping address"}
                        </button>
                    </Form.Item>
                </Form>
            </div>);
        }
        return "";
    };

    render() {
        if (this.props.disabled === true) {
            return (<div/>);
        }
        const script_url = "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_PLACES_API_KEY + "&libraries=places";
        return (
            <div>
                <div className="cf-title">
                    Address Delivery
                </div>
                <div className="col-md-12">
                    <div>
                        <Script
                            url={script_url}
                            onLoad={this.handleScriptLoad}
                        />
                        <Search id="autocomplete"
                                placeholder="Search for Your Address"
                                style={{
                                    margin: '0 auto',
                                    maxWidth: 800,
                                }}
                        />
                    </div>
                    <br/>
                    <div>
                        {this.renderForm()}
                    </div>
                </div>
            </div>
        );
    }
}

export class ParcelDeliveryLocationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            OtherLocations: [],
            NearestLocations: [],
            ParcelDeliveryLocation: this.props.ParcelDeliveryLocation,
            ParcelDeliveryLocationCountry: this.props.ParcelDeliveryLocationCountry,
            loadingParcelLocations: true,
            ShippingName: this.props.ShippingName,
        };
        this.getMyLocation();
        this.handleChange = this.handleChange.bind(this);
        this.getParcellLocations = this.getParcellLocations.bind(this);
        this.setShippingName = this.setShippingName.bind(this);
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextState.ParcelDeliveryLocation === undefined;
    }


    handleChange(value) {
        /*
        ParcelDeliveryLocation is formatted as Country+Name+,+Id. We can't to extract the name of the location from the value
         */
        const response = value.split(",");
        const ParcelDeliveryLocationCountry = response[0];
        const ParcelDeliveryLocationName = response[1];
        const ParcelDeliveryLocation = response[2];

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(ShippingCost_QUERY),
            variables: {
                jwt_token: (isRegularUserLoggedIn()) ? sessionStorage.getItem("jwtToken") : sessionStorage.getItem("temporary_user_id"),
                ParcelDeliveryLocation: ParcelDeliveryLocation,
                TimezoneOffset_M: new Date().getTimezoneOffset(),
                ShippingMethod: "ParcelDelivery",
                ShippingCurrency: this.props.ShippingCurrency
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed to fetch the shipping cost');
            }
            return res.data;
        }).then(resData => {

            const shippingcost = resData.data.DeliveryCost;
            axios.post(process.env.REACT_APP_SERVER_URL, {
                query: print(DeliveryEstimate_QUERY),
                variables: {
                    jwt_token: (isRegularUserLoggedIn()) ? sessionStorage.getItem("jwtToken") : sessionStorage.getItem("temporary_user_id"),
                    ParcelDeliveryLocation: ParcelDeliveryLocation,
                    TimezoneOffset_M: new Date().getTimezoneOffset(),
                    ShippingMethod: "ParcelDelivery",
                    ShippingCurrency: this.props.ShippingCurrency
                }
            }).then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed to fetch the delivery estimate cost');
                }
                return res.data;
            }).then(resData => {
                const deliveryEstimate = (resData.data.DeliveryTimeEstimate === -1) ? "" : resData.data.DeliveryTimeEstimate;

                //TODO: Make the ShippingCurrency dyanmic
                this.props.ShippingCostSelected(
                    this.state.ShippingName,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    ParcelDeliveryLocationCountry,
                    new Date().getTimezoneOffset(),
                    true,
                    "ParcelDelivery",
                    shippingcost,
                    ParcelDeliveryLocation,
                    ParcelDeliveryLocationName,
                    ParcelDeliveryLocationCountry,
                );

                this.props.DeliveryEstimateSelected(
                    deliveryEstimate
                );
            })

        }).catch(() => {
        });
    };

    setShippingName(event) {
        this.setState({
            ShippingName: event.target.value
        });
    }

    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation;
        if (location) {
            //TODO: make it accurte
            const positionOptions = {
                enableHighAccuracy: true, timeout: 20000, maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition((position) => {
                // console.log(position.coords.accuracy)
                return this.getParcellLocations(position.coords.latitude, position.coords.longitude);
            }, (error) => {
            }, positionOptions);
        } else {
            return this.getParcellLocations(0, 0);
        }
    }


    async getParcellLocations(MyLatitude, MyLongitude) {
        this.setState({
            loadingParcelLocations: true,
        });

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(ShippingLocations_QUERY),
            variables: {
                UserLatCoordinate: MyLatitude,
                UserLonCoordinate: MyLongitude
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                message.error('Failed to fetch the parcel Delivery locations');
            }
            return res.data;
        }).then(resData => {
                const nearestLocations = (MyLatitude !== 0 && MyLongitude !== 0) ? resData.data.ParcelDeliveryLocations.slice(0, 5) : [];
                const otherLocations = (MyLatitude !== 0 && MyLongitude !== 0) ? resData.data.ParcelDeliveryLocations.slice(5, resData.data.ParcelDeliveryLocations.length) : resData.data.ParcelDeliveryLocations;
                if (nearestLocations) {
                    this.setState({
                        NearestLocations: nearestLocations.map(location => (
                            <Option value={location.country + "," + location.name + "," + location._id}
                            >{getEmoji(location.provider)}{location.name}</Option>))
                    })
                }
                if (otherLocations) {
                    this.setState({
                        OtherLocations: otherLocations.map(location => (
                            <Option value={location.country + "," + location.name + "," + location._id}
                            >{getEmoji(location.provider)}{location.name}</Option>))
                    })
                }
            }
        );
        this.setState({
            loadingParcelLocations: false,
        });

    }

    render() {
        if (this.props.disabled === true) {
            return (<div/>);
        }
        const {NearestLocations, OtherLocations} = this.state;
        return (
            <div>
                <div className="cf-title">
                    Parcel Delivery
                </div>
                <div className="col-md-12">
                    <div className="row address-inputs">
                        <div className="col-md-12">
                            <input onChange={this.setShippingName} value={this.state.ShippingName} type="text"
                                   placeholder="Shipping name"/>
                        </div>
                        <br/>
                        <div className="col-md-12">
                            <div className="row address-inputs">
                                <Select
                                    showSearch
                                    autoFocus={true}
                                    className="container-fluid"
                                    style={{maxWidth: 800, minWidth: 300}}
                                    placeholder="Search for your favorite location"
                                    optionFilterProp="children"
                                    maxTagCount={5}
                                    onChange={this.handleChange}
                                    filterOption={true}
                                    value={(this.props.ParcelDeliveryLocationCountry !== undefined) ? <Emoji
                                        text={getEmoji(this.props.ParcelDeliveryLocationCountry) + " " + this.props.ParcelDeliveryLocation}/> : undefined}
                                >
                                    <OptGroup label="Near you">
                                        {NearestLocations}
                                    </OptGroup>
                                    <OptGroup label="Other locations">
                                        {OtherLocations}
                                    </OptGroup>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class GoToPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stripe: this.props.stripe,
            IsLoading: true,
        };
        this.goToCheckout = this.goToCheckout.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextState.gettingStripeId === true){
            return false
        }
        return true
    }


    componentDidMount() {
        if (window.Stripe) {
            this.setState({
                stripe: window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY),
                IsLoading:false

            });
        } else {
            document.querySelector('#stripe-js').addEventListener('load', () => {
                this.setState({
                    stripe:window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY),
                    IsLoading:false
                });
            });
        }

    }

    goToCheckout() {
        this.setState({gettingStripeId: true});
        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(CHECKOUT_MUTATION),
            variables: {
                jwt_token: this.props.jwt_token,
                ShippingName: this.props.ShippingName,
                ShippingAddressLine1: this.props.ShippingAddressLine1,
                ShippingAddressLine2: this.props.ShippingAddressLine2,
                ShippingCity: this.props.ShippingCity,
                ShippingRegion: this.props.ShippingRegion,
                ShippingZip: this.props.ShippingZip,
                ShippingCountry: this.props.ShippingCountry,
                ShippingMethod: this.props.ShippingMethod,
                ShippingCost: this.props.ShippingCost,
                ShippingCurrency: this.props.ShippingCurrency,
                taxCost: this.props.taxCost,
                ParcelDeliveryLocation: this.props.ParcelDeliveryLocation,
                deliveryEstimate_UTC: this.props.deliveryEstimate_UTC,
                TimezoneOffset_M: this.props.TimezoneOffset_M,
                totalCost: this.props.taxCost + this.props.ShippingCost + this.props.orderSubtotal
            }
        }).then(res => {
            alert(JSON.stringify(res));

            if (res.status !== 200 && res.status !== 201) {
                message.error('Failed to proceed to payment');
                return;
            }
            return res.data;
        }).then(resData => {
            console.log(resData)
            this.state.stripe.redirectToCheckout({sessionId: resData.data.showCheckout.sessionId});
        });
        this.setState({IsLoading: false});
    };

    render() {
        return (
            <Skeleton loading={this.state.IsLoading}>
                <div>
                    <button disabled={this.props.disabled}
                            style={{backgroundColor: "#1F96FE"}}
                            className="site-btn submit-order-btn"
                            onClick={this.goToCheckout}>
                        {this.state.IsLoading && loadingIcon}
                        {!this.state.IsLoading && "Proceed to Payment"}
                    </button>
                </div>
            </Skeleton>
        );
    }
}