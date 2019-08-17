import axios from 'axios';
import {print} from "graphql";
import Emoji from "react-emoji-render";
import Script from 'react-load-script';

import React, {Component} from "react";
import gql from "graphql-tag";
import {Form, message, Icon, Input, Select, Skeleton} from "antd";
import {isRegularUserLoggedIn} from "../../components/Authentication";
import {getEmoji} from "../../components/Emoji";


const Search = Input.Search;
const loadingIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;
const {Option, OptGroup} = Select;


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
const ShippingLocations_QUERY = gql`
    query($UserLatCoordinate: Float!,$UserLonCoordinate: Float!){
        ParcelDeliveryLocations(UserLatCoordinate: $UserLatCoordinate,UserLonCoordinate: $UserLonCoordinate){
            _id
            name
            provider
            country
        }
    }
`;
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
        $taxCost:Float,
        $ShippingCurrency:String!,
        $deliveryEstimate_UTC:String,
        $totalCost:Float
    ) {
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
            ShippingCost:$ShippingCost,
            taxCost:$taxCost,
            ShippingCurrency:$ShippingCurrency,
            deliveryEstimate_UTC:$deliveryEstimate_UTC,
            totalCost:$totalCost
        }
        ) {
            sessionId
        }
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
                const deliveryEstimate = (resData.data.DeliveryTimeEstimate === -1) ? "" : resData.data.DeliveryTimeEstimate;

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
                                className="btn btn-primary btn-lg btn-block" type="submit">
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
                    {this.renderForm()}

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
        const TimezoneOffset_M = new Date().getTimezoneOffset();
        const jwt_token = (isRegularUserLoggedIn()) ? sessionStorage.getItem("jwtToken") : sessionStorage.getItem("temporary_user_id");


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
                const locations = resData.data.ParcelDeliveryLocations;
                const nearestLocations = (MyLatitude !== 0 && MyLongitude !== 0) ? locations.slice(0, 5) : [];
                const otherLocations = (MyLatitude !== 0 && MyLongitude !== 0) ? locations.slice(5, locations.length) : locations;
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
            <div className="col-md-12">
                <br/>
                <Input value={this.state.ShippingName} placeholder="Shipping name" allowClear
                       onChange={this.setShippingName}/>
                <br/>
                <br/>
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

    goToCheckout() {
        this.setState({IsLoading: true});
        let {
            jwt_token, ShippingName, ShippingAddressLine1, ShippingAddressLine2, ShippingCity, ShippingRegion, ShippingZip,
            ShippingCountry, TimezoneOffset_M, ShippingMethod, ShippingCost, ParcelDeliveryLocation, ShippingCurrency, taxCost,deliveryEstimate_UTC,orderSubtotal
        } = this.props;

        axios.post(process.env.REACT_APP_SERVER_URL, {
            query: print(CHECKOUT_MUTATION),
            variables: {
                jwt_token: jwt_token,
                ShippingName: ShippingName,
                ShippingAddressLine1: ShippingAddressLine1,
                ShippingAddressLine2: ShippingAddressLine2,
                ShippingCity: ShippingCity,
                ShippingRegion: ShippingRegion,
                ShippingZip: ShippingZip,
                ShippingCountry: ShippingCountry,
                ShippingMethod: ShippingMethod,
                ShippingCost: ShippingCost,
                ShippingCurrency: ShippingCurrency,
                taxCost: taxCost,
                ParcelDeliveryLocation: ParcelDeliveryLocation,
                deliveryEstimate_UTC:deliveryEstimate_UTC,
                TimezoneOffset_M: TimezoneOffset_M,
                totalCost:taxCost+ShippingCost+orderSubtotal
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                message.error('Failed to proceed to payment');
                return;
            }
            return res.data;
        }).then(resData => {
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
                            className="btn btn-primary btn-lg btn-block"
                            onClick={this.goToCheckout}>
                        {this.state.IsLoading && loadingIcon}
                        {!this.state.IsLoading && "Proceed to Payment"}
                    </button>
                </div>
            </Skeleton>
        );
    }
}