import Script from 'react-load-script';

import React from "react";
import {Form, Icon, Input, Skeleton} from "antd";
import {ShippingCost_QUERY} from "../../../graphql/shippingCost_QUERY";
import {DeliveryEstimate_QUERY} from "../../../graphql/deliveryEstimate_QUERY";
import {fetchData} from "../../../common/fetcher";


const Search = Input.Search;
const loadingIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;
const searchFormStyle = {
    margin: '0 auto',
    maxWidth: 800,
};
const script_url = "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_PLACES_API_KEY + "&libraries=places";


export class AddressForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            route: '',
            ShippingName: this.props.ShippingName,
            ShippingRoute: '',
            ShippingAddressLine1: '',
            ShippingAddressLine2: '',
            ShippingCity: '',
            ShippingRegion: '',
            ShippingZip: '',
            ShippingCountry: '',
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

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        console.log(nextProps);
        return this.props.ShippingAddressLine1 !== nextProps.ShippingAddressLine1;
    }


    handleAddressSubmit = async e => {
        e.preventDefault();
        alert("submittind, yay")
        this.setState({SavingAddressInfo: true});

        let variables = {
            jwt_token: sessionStorage.getItem("jwtToken"),
            TimezoneOffset_M: new Date().getTimezoneOffset(),
            ShippingCountry: this.state.ShippingCountry,
            ShippingMethod: "AddressDelivery",
            ShippingCurrency: this.props.ShippingCurrency
        };
        let fetchShippingCost = fetchData(variables, ShippingCost_QUERY);

        variables = {
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
        };
        let fetchDeliveryEstimate = fetchData(variables, DeliveryEstimate_QUERY);
        let shippingCostFromDB = await fetchShippingCost;

        if (shippingCostFromDB !== null) {
            const shippingCost = shippingCostFromDB.DeliveryCost;
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
                shippingCost,
                undefined,
                undefined,
                undefined,
            );
        }
        let deliveryEstimateFromDB = await fetchDeliveryEstimate;
        if (deliveryEstimateFromDB != null) {
            const deliveryEstimate = (deliveryEstimateFromDB.DeliveryTimeEstimate === -1) ? "" : deliveryEstimateFromDB.DeliveryTimeEstimate;
            this.props.DeliveryEstimateSelected(
                deliveryEstimate
            );
        }
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

    componentDidUpdate(prevProps, prevState) {
        console.log("ADRRESS FROM componentDidUpdate")
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
        this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
    }

    handlePlaceSelect() {
        alert("i made it here");
        let addressObject = this.autocomplete.getPlace();
        alert(addressObject.formatted_address)
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
        this.setState({SavingAddressInfo: false});
        this.setState({hasSearchedWithGoogle: true});
    }

    renderForm() {
        const {hasSearchedWithGoogle} = this.state;

        if (hasSearchedWithGoogle === true) {
            console.log(this.state);
            let {ShippingName, ShippingAddressLine1, ShippingAddressLine2, ShippingCity, ShippingRegion, ShippingZip, ShippingCountry} = this.props;
            //After the page reloads
            return (
                <div className="container">
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
                </div>
            );
        }
        return "";
    };

    render() {
        if (this.props.disabled === true) {
            return (<div/>);
        }
        return (
            <React.Fragment>
                <div className="cf-title">
                    Address Delivery
                </div>
                <div className="col-md-12">
                    <Script
                        url={script_url}
                        onLoad={this.handleScriptLoad}
                    />
                    <Search id="autocomplete"
                            placeholder="Search for Your Address"
                            style={searchFormStyle}
                    />
                    <br/>
                    {this.renderForm()}
                </div>
            </React.Fragment>
        );
    }
}