import React, {Component} from "react";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {Form, Icon, Input, Select, Skeleton, Steps} from "antd";
import {print} from 'graphql';
import Emoji from 'react-emoji-render';


import {Helmet} from "react-helmet";
import Script from 'react-load-script';
import Footer from "../navbarAndFooter/Footer.jsx";

import omniva_logo from './ParcelDeliveryLocation_img/omniva-logo.png';
import itella_logo from './ParcelDeliveryLocation_img/itella-logo.svg';
import dbd_logo from './ParcelDeliveryLocation_img/dpd-logo.png';

import axios from 'axios';


const Search = Input.Search;
const {Step} = Steps;
const loadingIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;
const {Option, OptGroup} = Select;


const CHECKOUT_MUTATION = gql`
    mutation showCheckout(
        $jwt_token: String!,
        $ParcelDeliveryLocation:ID,
        $TimezoneOffset_M:Int!,
        $ShippingName:String,
        $ShippingAddressLine1:String,
        $ShippingAddressLine2:String,
        $ShippingCity:String,
        $ShippingRegion:String,
        $ShippingZip:String,
        $ShippingCountry:String,
        $ShippingMethod:String!,
        $ShippingCost:Float,
        $ShippingCurrency:String!) {
        showCheckout(checkoutInput:{jwt_token:$jwt_token,
            ParcelDeliveryLocation:$ParcelDeliveryLocation,
            TimezoneOffset_M:$TimezoneOffset_M,
            ShippingName:$ShippingName,
            ShippingAddressLine1:$ShippingAddressLine1,
            ShippingAddressLine2:$ShippingAddressLine2,
            ShippingCity:$ShippingCity,
            ShippingRegion:$ShippingRegion,
            ShippingZip:$ShippingZip,
            ShippingCountry:$ShippingCountry,
            ShippingMethod:$ShippingMethod,
            ShippingCost:$ShippingCost
            ShippingCurrency:$ShippingCurrency
        }
        ) {
            sessionId
        }
    }
`;
const Deliverycost_QUERY = gql`
    query DeliveryCost($jwt_token: String!,
        $ParcelDeliveryLocation:ID,
        $TimezoneOffset_M:Int!,
        $ShippingCountry:String,
        $ShippingMethod:String!,
        $ShippingCurrency:String!) {
        DeliveryCost(deliverycostInput:{
            jwt_token:$jwt_token,
            ParcelDeliveryLocation:$ParcelDeliveryLocation,
            TimezoneOffset_M:$TimezoneOffset_M,
            ShippingCountry:$ShippingCountry,
            ShippingMethod:$ShippingMethod,
            ShippingCurrency:$ShippingCurrency
        })
    }
`;


const DeliveryEstimate_QUERY = gql`
    query DeliveryTimeEstimate(
        $jwt_token: String!,
        $ParcelDeliveryLocation:ID,
        $TimezoneOffset_M:Int!,
        $ShippingName:String,
        $ShippingAddressLine1:String,
        $ShippingAddressLine2:String,
        $ShippingCity:String,
        $ShippingRegion:String,
        $ShippingZip:String,
        $ShippingCountry:String,
        $ShippingMethod:String!,
        $ShippingCost:Float,
        $ShippingCurrency:String!) {
        DeliveryTimeEstimate(deliverytimeEstimateInput:{
            jwt_token:$jwt_token,
            ParcelDeliveryLocation:$ParcelDeliveryLocation,
            TimezoneOffset_M:$TimezoneOffset_M,
            ShippingName:$ShippingName,
            ShippingAddressLine1:$ShippingAddressLine1,
            ShippingAddressLine2:$ShippingAddressLine2,
            ShippingCity:$ShippingCity,
            ShippingRegion:$ShippingRegion,
            ShippingZip:$ShippingZip,
            ShippingCountry:$ShippingCountry,
            ShippingMethod:$ShippingMethod,
            ShippingCost:$ShippingCost,
            ShippingCurrency:$ShippingCurrency
        })
    }
`;

function formatDeliveryEstimate(DeliveryEstimate) {
    //TODO: move this logic to backend
    const ONE_MINUTE_in_MS = 60000;
    const ONE_HOUR_in_MS = 3600000;
    const ONE_DAY_in_MS = 86400000;
    const ONE_WEEK_in_MS = 604800000;
    const ONE_MONTH_in_MS = 2592000000;
    const ONE_YEAR_in_MS = 31536000000;
    //TODO: debug
    //DeliveryEstimate is adjusted to local timezone

    let estimate = undefined;

    const CurrentTimestamp = Math.round(new Date(new Date().getTime() + new Date().getTimezoneOffset()).getTime() / 1000);

    const CurrentDate = new Date(CurrentTimestamp);
    const ArraivalDate = new Date(parseInt(DeliveryEstimate, 10));


    //   const CurrentMonth = CurrentDate.getUTCMonth() + 1; //months from 1-12
    //   const CurrentDay = CurrentDate.getUTCDate(); // e.g 01
    //    const CurrentYear = CurrentDate.getUTCFullYear();
    const CurrentDayOfWeek = CurrentDate.getUTCDay(); // 1-Monday
    //    const CurrentHour = CurrentDate.getUTCHours();
    //    const CurrentMinute = CurrentDate.getUTCMinutes();

    //   const ArraivalMonth = ArraivalDate.getUTCMonth() + 1; //months from 1-12
    //    const ArraivalDay = ArraivalDate.getUTCDate(); // e.g 01
    //    const ArraivalYear = ArraivalDate.getUTCFullYear();
    const ArraivalDayOfWeek = ArraivalDate.getUTCDay(); // 1-Monday
    const ArrivalHour = ArraivalDate.getUTCHours();
    //  const ArrivalMinute = ArraivalDate.getUTCMinutes();

    //Relative arrival time
    /*
    Night - 22-04
    Morning- 05-11
    Noon- 11-15
    Afternoon - 15-17
    Evening- 17-22
     */
    let RelativeArrivalTime = undefined;
    if (ArrivalHour < 4) {
        RelativeArrivalTime = "night";
    } else if (ArrivalHour < 11) {
        RelativeArrivalTime = "morning";
    } else if (ArrivalHour < 15) {
        RelativeArrivalTime = "noon";
    } else if (ArrivalHour < 17) {
        RelativeArrivalTime = "afternoon";
    } else if (ArrivalHour < 22) {
        RelativeArrivalTime = "evening";
    } else {
        RelativeArrivalTime = "night";
    }

    const dif = parseInt(DeliveryEstimate, 10) - CurrentTimestamp;

    //1. Is the delivery time instant (< 1m)
    if (dif < ONE_MINUTE_in_MS) {
        estimate = "Instantly"
    }
    //2. Is the delivery time under an hour (< 1h)
    else if (dif < ONE_HOUR_in_MS) {
        estimate = "In an hour"
    }
    //3. Is the delivery time under 1 day (< 24h)
    else if (dif < ONE_DAY_in_MS) {
        //Does it arrive today
        if (ArraivalDayOfWeek === CurrentDayOfWeek) {
            estimate = "Today " + RelativeArrivalTime + " around " + ArrivalHour;
        } else {
            estimate = "Tomorrow " + RelativeArrivalTime + " around " + ArrivalHour;
        }
    }
    //4. Is the delivery time under 1 week (< 7d)
    else if (dif < ONE_WEEK_in_MS) {
        const dayDif = Math.floor(dif / ONE_DAY_in_MS);
        estimate = "In " + dayDif + "days at around " + ArrivalHour;
    }
    //5. Is the delivery time under 1 month (< 30d)
    else if (dif < ONE_MONTH_in_MS) {
        const weekDif = Math.floor(dif / ONE_WEEK_in_MS);
        estimate = (weekDif === 1) ? "In 1 week" : "In " + weekDif + "weeks";
    }
    //6. Is the delivery time under 1 year (< 30d)
    else if (dif < ONE_YEAR_in_MS) {
        const monDif = Math.floor(dif / ONE_MONTH_in_MS);
        estimate = (monDif === 1) ? "In 1 month" : "In " + monDif + " months";
    }
    //6. Show difference in years and months
    else {
        const yearDif = Math.floor(dif / ONE_YEAR_in_MS);
        const monDif = Math.floor((dif - yearDif * ONE_YEAR_in_MS) / ONE_MONTH_in_MS);
        estimate = "In " + yearDif + " years and " + monDif + ((monDif === 1) ? " month" : " months");
    }
    return estimate;
}

class AddressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            route: '',
            ShippingName: '',
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
            canSubmit: false,
            SavingAddressInfo: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAddressSubmit = this.handleAddressSubmit.bind(this);
        this.handleScriptLoad = this.handleScriptLoad.bind(this);
        this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    }


    async getUserFullName() {
        const jwt_token = sessionStorage.getItem("jwtToken");
        const ResponseUsername = await axios.post(process.env.REACT_APP_SERVER_URL, {
            query: `
          query individualUser($jwt_token: String!){
         individualUser(jwt_token:$jwt_token) {
                  fullname
                }
    }
  `,
            variables: {
                jwt_token: jwt_token
            }
        });

        if (ResponseUsername.status === 200 || ResponseUsername.status === 201) {
            const fullname = ResponseUsername.data.data.individualUser.fullname;
            this.setState({
                ShippingName: fullname
            });
            this.validateField("ShippingName", this.state.ShippingName);
        }
    }

    componentDidMount() {
        this.getUserFullName();
    }

    handleAddressSubmit = e => {
        e.preventDefault();
        this.setState({SavingAddressInfo: true});
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {ShippingName, ShippingAddressLine1, ShippingAddressLine2, ShippingCity, ShippingRegion, ShippingZip, ShippingCountry} = this.state;
                const TimezoneOffset_M = new Date().getTimezoneOffset();
                const jwt_token = sessionStorage.getItem("jwtToken");

                axios.post(process.env.REACT_APP_SERVER_URL, {
                    query: print(Deliverycost_QUERY),
                    variables: {
                        jwt_token: jwt_token,
                        TimezoneOffset_M: new Date().getTimezoneOffset(),
                        ShippingCountry: ShippingCountry,
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
                            jwt_token: jwt_token,
                            TimezoneOffset_M: TimezoneOffset_M,
                            ShippingAddressLine1: ShippingAddressLine1,
                            ShippingAddressLine2: ShippingAddressLine2,
                            ShippingCity: ShippingCity,
                            ShippingRegion: ShippingRegion,
                            ShippingZip: ShippingZip,
                            ShippingCountry: ShippingCountry,
                            ShippingMethod: "AddressDelivery",
                            ShippingCurrency: this.props.ShippingCurrency
                        }
                    }).then(res => {
                        if (res.status !== 200 && res.status !== 201) {
                            throw new Error('Failed to fetch the delivery estimate cost');
                        }
                        return res.data;
                    }).then(resData => {
                        const deliveryEstimate = (resData.data.DeliveryTimeEstimate === -1) ? "" : formatDeliveryEstimate(resData.data.DeliveryTimeEstimate);

                        //TODO: Make the ShippingCurrency dyanmic
                        this.props.ShippingCostSelected(
                            ShippingName,
                            ShippingAddressLine1,
                            ShippingAddressLine2,
                            ShippingCity,
                            ShippingRegion,
                            ShippingZip,
                            ShippingCountry,
                            TimezoneOffset_M,
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
            }
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

        const isShippingName = name === "ShippingName";
        const isShippingAddressLine1 = name === "ShippingAddressLine1";
        const isShippingAddressLine2 = name === "ShippingAddressLine2";
        const isShippingCity = name === "ShippingCity";
        const isShippingZip = name === "ShippingZip";
        const isShippingCountry = name === "ShippingCountry";
        const isShippingRegion = name === "ShippingRegion";

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
                if (isShippingName) {
                    validity[name] = value.length >= 4;
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Shipping name's length should be greater than 4`);
                } else if (isShippingAddressLine1) {
                    // fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                } else if (isShippingCity) {
                    // fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                } else if (isShippingRegion) {
                    // fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                } else if (isShippingZip) {
                    // fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                } else if (isShippingCountry) {
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
    }

    render() {
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

        const script_url = "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_PLACES_API_KEY + "&libraries=places";
        return (
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
                <br/><br/>
                <div>
                    <div className="container">
                        <div className="row">
                            <Form onSubmit={this.handleAddressSubmit} className="login-form">
                                <Form.Item>
                                    <label htmlFor="ShippingName">Shipping Name</label>
                                    <Input
                                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingName)}`}
                                        id="ShippingName"
                                        name="ShippingName"
                                        type="text"
                                        placeholder="Full name"
                                        value={ShippingName}
                                        onChange={this.handleChange}
                                    />
                                    <div className="invalid-feedback">{this.state.formErrors.ShippingName}</div>
                                </Form.Item>
                                <Form.Item>
                                    <label htmlFor="ShippingAddressLine1">Address line 1</label>
                                    <Input
                                        prefix={<Icon type="home" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingAddressLine1)}`}
                                        id="ShippingAddressLine1"
                                        name="ShippingAddressLine1"
                                        type="text"
                                        placeholder="Street address"
                                        value={ShippingAddressLine1}
                                        onChange={this.handleChange}
                                    />
                                    <div
                                        className="invalid-feedback">{this.state.formErrors.ShippingAddressLine1}</div>
                                </Form.Item>
                                <Form.Item>
                                    <label htmlFor="ShippingAddressLine2">Address line 2</label>
                                    <Input
                                        prefix={<Icon type="number" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingAddressLine2)}`}
                                        id="ShippingAddressLine2"
                                        name="ShippingAddressLine2"
                                        type="text"
                                        placeholder="Apartment, suite, building, floor"
                                        value={ShippingAddressLine2}
                                        onChange={this.handleChange}
                                    />
                                    <div
                                        className="invalid-feedback">{this.state.formErrors.ShippingAddressLine2}</div>
                                </Form.Item>
                                <Form.Item>
                                    <label htmlFor="ShippingCity">City/Town</label>
                                    <Input
                                        prefix={<Icon type="flag" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingCity)}`}
                                        id="ShippingCity"
                                        name="ShippingCity"
                                        type="text"
                                        placeholder="City/Town"
                                        value={ShippingCity}
                                        onChange={this.handleChange}
                                    />
                                    <div className="invalid-feedback">{this.state.formErrors.ShippingCity}</div>
                                </Form.Item>
                                <Form.Item>
                                    <label htmlFor="ShippingRegion">Region</label>
                                    <Input
                                        prefix={<Icon type="funnel-plot" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingRegion)}`}
                                        id="ShippingRegion"
                                        name="ShippingRegion"
                                        type="text"
                                        placeholder="State/Province/Region"
                                        value={ShippingRegion}
                                        onChange={this.handleChange}
                                    />
                                    <div className="invalid-feedback">{this.state.formErrors.ShippingRegion}</div>
                                </Form.Item>
                                <Form.Item>
                                    <label htmlFor="ShippingZip">Zip</label>
                                    <Input
                                        prefix={<Icon type="environment" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingZip)}`}
                                        id="ShippingZip"
                                        name="ShippingZip"
                                        type="text"
                                        placeholder="Zip/Postal code"
                                        value={ShippingZip}
                                        onChange={this.ShippingZip}
                                    />
                                    <div className="invalid-feedback">{this.state.formErrors.ShippingCity}</div>
                                </Form.Item>
                                <Form.Item>
                                    <label htmlFor="ShippingCountry">Country</label>
                                    <Input
                                        prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        className={`form-control ${this.errorClass(this.state.formErrors.ShippingCountry)}`}
                                        id="ShippingCountry"
                                        name="ShippingCountry"
                                        type="text"
                                        placeholder="Country"
                                        value={ShippingCountry}
                                        onChange={this.ShippingCountry}
                                    />
                                    <div className="invalid-feedback">{this.state.formErrors.ShippingCountry}</div>
                                </Form.Item>
                                <Form.Item>
                                    <button disabled={!this.state.canSubmit || this.state.SavingAddressInfo}
                                            className="btn btn-primary btn-lg btn-block" type="submit">
                                        {(this.state.SavingAddressInfo) ? {loadingIcon} : "Save your shipping address"}
                                    </button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ParcelDeliveryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            OtherLocations: [],
            NearestLocations: [],
            ParcelDeliveryLocation: this.props.ParcelDeliveryLocation,
            ParcelDeliveryLocationCountry: this.props.ParcelDeliveryLocationCountry,
            loadingParcelLocations: true,
        };
        this.getMyLocation();
        this.handleChange = this.handleChange.bind(this);
        this.getParcellLocations = this.getParcellLocations.bind(this);
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
        const TimezoneOffset_M = new Date().getTimezoneOffset();
        const jwt_token = sessionStorage.getItem("jwtToken");


        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(Deliverycost_QUERY),
            variables: {
                jwt_token: jwt_token,
                ParcelDeliveryLocation: ParcelDeliveryLocation,
                TimezoneOffset_M: TimezoneOffset_M,
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
                    jwt_token: jwt_token,
                    ParcelDeliveryLocation: ParcelDeliveryLocation,
                    TimezoneOffset_M: TimezoneOffset_M,
                    ShippingMethod: "ParcelDelivery",
                    ShippingCurrency: this.props.ShippingCurrency
                }
            }).then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed to fetch the delivery estimate cost');
                }
                return res.data;
            }).then(resData => {
                const deliveryEstimate = (resData.data.DeliveryTimeEstimate === -1) ? "" : formatDeliveryEstimate(resData.data.DeliveryTimeEstimate);
                console.log("hi");

                //TODO: Make the ShippingCurrency dyanmic
                this.props.ShippingCostSelected(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    ParcelDeliveryLocationCountry,
                    TimezoneOffset_M,
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

        }).catch(err => {
            console.log(err);
        });
    };

    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation;
        if (location) {
            //TODO: make it accurte
            const positionOptions = {
                enableHighAccuracy: true, timeout: 20000, maximumAge: 10000
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
        const ParcelResponse = await axios.post(process.env.REACT_APP_SERVER_URL, {
            query: `
            query($UserLatCoordinate: Float!,$UserLonCoordinate: Float!){
        ParcelDeliveryLocations(UserLatCoordinate: $UserLatCoordinate,UserLonCoordinate: $UserLonCoordinate){
            _id
            name
            provider
            country
        }
    }
  `,
            variables: {
                UserLatCoordinate: MyLatitude,
                UserLonCoordinate: MyLongitude
            }
        });

        //If everything went well, set the Parcell Delivery Locations
        if (ParcelResponse.status === 200 || ParcelResponse.status === 201) {
            const locations = ParcelResponse.data.data.ParcelDeliveryLocations;
            const nearestLocations = (MyLatitude !== 0 && MyLongitude !== 0) ? locations.slice(0, 5) : [];
            const otherLocations = (MyLatitude !== 0 && MyLongitude !== 0) ? locations.slice(5, locations.length) : locations;
            if (nearestLocations) {
                this.setState({
                    NearestLocations: nearestLocations.map(location => (
                        <Option value={location.country + "," + location.name + "," + location._id}
                        >{this.getEmoji(location.provider)}{location.name}</Option>))
                })
            }
            if (otherLocations) {
                this.setState({
                    OtherLocations: otherLocations.map(location => (
                        <Option value={location.country + "," + location.name + "," + location._id}
                        >{this.getEmoji(location.provider)}{location.name}</Option>))
                })
            }
        }
        this.setState({
            loadingParcelLocations: false,
        });

    }

    getEmoji(name) {
        switch (name) {
            case "Estonia":
                return "🇪🇪";
            case "Latvia":
                return "🇱🇻";
            case "Lithuania":
                return "🇱🇹";
            case "Omniva":
                return <span role="img" aria-label="Omniva"><img src={omniva_logo} width="28" height="28"
                                                                 alt="Omniva"/> </span>;
            case "Itella":
                return <span role="img" aria-label="Itella"><img src={itella_logo} width="28" height="28"
                                                                 alt="Itella"/> </span>;
            case "DPD":
                return <span role="img" aria-label="DPD"><img src={dbd_logo} width="28" height="28"
                                                              alt="DPD"/> </span>;
        }
    }


    render() {
        const {NearestLocations, OtherLocations} = this.state;
        return (
            <div className="col-md-12">
                <h2>Please choose the location</h2>
                <Select
                    showSearch
                    autoFocus={true}
                    className="container-fluid"
                    style={{maxWidth: 800, minWidth: 300}}
                    placeholder="Search for your favorite location"
                    optionFilterProp="children"
                    maxTagCount={5}
                    onDeselect={this.deselectParcelDeliveryLocation}
                    onChange={this.handleChange}
                    filterOption={true}
                    value={
                        (this.props.ParcelDeliveryLocationCountry !== undefined) ?
                            <Emoji
                                text={
                                    this.getEmoji(this.props.ParcelDeliveryLocationCountry) + " " + this.props.ParcelDeliveryLocation
                                }
                            />
                            : undefined
                    }
                >
                    <OptGroup label="Near you">
                        {NearestLocations}
                    </OptGroup>
                    <OptGroup label="Other locations">
                        {OtherLocations}
                    </OptGroup>
                </Select>
            </div>
        );
    }
}

class GoToPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stripe: this.props.stripe,
            IsLoading: true,
        };
    }

    componentDidMount() {
        if (window.Stripe) {
            this.setState({stripe: window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)});
        } else {
            document.querySelector('#stripe-js').addEventListener('load', () => {
                this.setState({stripe: window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)});
            });
        }
        this.setState({IsLoading: false});
    }


    render() {
        const stripe = this.state.stripe;

        let {
            jwt_token,
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
        } = this.props;

        return (
            <div>
                <Skeleton loading={this.state.IsLoading}>
                    <Mutation
                        mutation={CHECKOUT_MUTATION}
                        variables={{
                            jwt_token,
                            ParcelDeliveryLocation,
                            TimezoneOffset_M,
                            ShippingName,
                            ShippingAddressLine1,
                            ShippingAddressLine2,
                            ShippingCity,
                            ShippingRegion,
                            ShippingZip,
                            ShippingCountry,
                            ShippingMethod,
                            ShippingCost,
                            ShippingCurrency
                        }}
                        onCompleted={({showCheckout}) => {
                            if (showCheckout) {
                                const id = showCheckout.sessionId;
                                // Redirect to Stripe Checkout
                                stripe.redirectToCheckout({sessionId: id})
                            }
                        }
                        }
                    >
                        {(showCheckout, {loading, error}) => (
                            <div>
                                <button disabled={this.props.disabled}
                                        className="btn btn-primary btn-lg btn-block"
                                        onClick={showCheckout}>
                                    {loading && loadingIcon}
                                    {!loading && "Proceed to Payment"}
                                </button>
                                {error && console.log(error)}
                            </div>
                        )}
                    </Mutation>
                </Skeleton>

            </div>
        );
    }
}


export default class Checkout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionId: '',
            ShippingForm: '',
            goingToPayment: false,
            goingToPaymentButtonClicked: false,
            ShippingCurrencySymbol: "€",

            ShippingName: undefined,
            ShippingAddressLine1: undefined,
            ShippingAddressLine2: undefined,
            ShippingCity: undefined,
            ShippingRegion: undefined,
            ShippingZip: undefined,
            ShippingCountry: undefined,
            TimezoneOffset_M: undefined,
            ShippingMethod: undefined,
            ShippingCost: "Choose a shipping location",
            ParcelDeliveryLocation: undefined,
            ParcelDeliveryLocationName: undefined,
            ParcelDeliveryLocationCountry: undefined,
            ShippingCurrency: "EUR",
            ShippingValuesAreValid: false,
            ShippingEstimatedDeliveryTime: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.DeliveryEstimateSelected = this.DeliveryEstimateSelected.bind(this);
        this.ShippingCostSelected = this.ShippingCostSelected.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        const {name, value} = event.target;
        this.setState({
            [name]: value
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
            ShippingCost: ShippingCost,
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


    showShippingForm() {
        const shippingmethod = this.state.ShippingMethod;
        const WrappedAddressForm = Form.create()(AddressForm);
        const WrappedParcelDeliveryForm = Form.create()(ParcelDeliveryForm);

        if (shippingmethod === "AddressDelivery") {
            let {
                ShippingName,
                ShippingAddressLine1,
                ShippingAddressLine2,
                ShippingCity,
                ShippingRegion,
                ShippingZip,
                ShippingCountry,
                ShippingCurrency,
            } = this.state;
            return <WrappedAddressForm
                ShippingName={ShippingName}
                ShippingAddressLine1={ShippingAddressLine1}
                ShippingAddressLine2={ShippingAddressLine2}
                ShippingCity={ShippingCity}
                ShippingRegion={ShippingRegion}
                ShippingZip={ShippingZip}
                ShippingCountry={ShippingCountry}
                ShippingCurrency={ShippingCurrency}
                DeliveryEstimateSelected={this.DeliveryEstimateSelected}
                ShippingCostSelected={this.ShippingCostSelected}/>;
        } else if (shippingmethod === "ParcelDelivery") {
            return <WrappedParcelDeliveryForm
                ShippingCurrency={this.state.ShippingCurrency}
                ParcelDeliveryLocationCountry={this.state.ParcelDeliveryLocationCountry}
                ParcelDeliveryLocation={this.state.ParcelDeliveryLocationName}
                DeliveryEstimateSelected={this.DeliveryEstimateSelected}
                ShippingCostSelected={this.ShippingCostSelected}/>;
        }
    }

    render() {
        //SEO
        const keywords = ["checkout", "shipping", "RocketNow"];
        const cannonial_url = process.env.REACT_APP_CLIENT_URL + "/checkout";
        const jwt_token = sessionStorage.getItem("jwtToken");

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
            ShippingValuesAreValid,
            ShippingEstimatedDeliveryTime
        } = this.state;
        let ShippingCurrencySymbol = (ShippingValuesAreValid === true) ? this.state.ShippingCurrencySymbol : "";

        let beautified_shipping_method = (ShippingMethod === "ParcelDelivery") ? "Parcel Delivery" : "Address Delivery";


        return (
            <div>
                <Helmet>
                    <title>RocketNow Checkout </title>
                    <meta name="keywords" content={keywords}/>
                    <link rel="canonial" href={cannonial_url}/>
                </Helmet>
                <br/>
                <br/>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <Steps current={1}>
                                <Step status="finish" title="Select products"
                                      icon={<Icon type="shopping-cart"/>}/>
                                <Step title="Shipping information" icon={<Icon type="rocket"/>}/>
                                <Step title="Payment" icon={<Icon type="bank"/>}/>
                                <Step title="Success" icon={<Icon type="smile"/>}/>
                            </Steps>
                        </div>
                    </div>
                </div>
                <br/> <br/> <br/>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h2> Select the shipping option </h2><br/>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="btn-toolbar" role="toolbar" aria-label="Shipping options">
                                        <div className="btn-group mr-2" role="group"
                                             aria-label="Address Delivery">
                                            <button className="btn btn-primary btn-lg" type="button"
                                                    name="ShippingMethod"
                                                    value="AddressDelivery"
                                                    onClick={this.handleChange}>Address delivery
                                            </button>
                                        </div>
                                        <div className="btn-group mr-2" role="group"
                                             aria-label="Parcel Delivery">
                                            <button className="btn btn-primary btn-lg" type="button"
                                                    name="ShippingMethod"
                                                    value="ParcelDelivery"
                                                    onClick={this.handleChange}>Parcel Terminal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                {this.showShippingForm()}
                            </div>
                        </div>
                        <div className="col-md-1">
                            <br/><br/><br/>
                        </div>
                        <div className="col-md-5">
                            <h2>Summary</h2>
                            <table className="table table-hover">
                                <tbody>
                                <tr>
                                    <th scope="row"><h6>Shipping method</h6></th>
                                    <td><h6>{beautified_shipping_method}</h6></td>
                                </tr>
                                <tr>
                                    <th scope="row"><h5>Shipping cost</h5></th>
                                    <td><h5><b>
                                        {ShippingCost}
                                        {ShippingCurrencySymbol}
                                    </b></h5></td>
                                </tr>
                                <tr>
                                    <th scope="row"><h5>Estimated delivery time</h5></th>
                                    <td><h5><b>{ShippingEstimatedDeliveryTime}</b></h5></td>
                                </tr>
                                </tbody>
                            </table>
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
                                ShippingCost={ShippingCost}
                                ParcelDeliveryLocation={ParcelDeliveryLocation}
                                ShippingCurrency={ShippingCurrency}
                                disabled={!ShippingValuesAreValid}
                            />
                        </div>
                    </div>
                </div>
                < br/> < br/> < br/> < br/>
                < Footer/>
            </div>
        );
    }
}