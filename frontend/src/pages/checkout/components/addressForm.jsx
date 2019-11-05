import React from "react";
import {Form, Icon} from "antd";
import {ShippingCost_QUERY} from "../../../graphql/shippingCost_QUERY";
import {orderDeliveryEstimate_QUERY} from "../graphql/orderDeliveryEstimate_QUERY";
import {fetchData} from "../../../common/fetcher";
import countryList from 'react-select-country-list';

export class AddressForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ShippingName: this.props.ShippingName,
            ShippingAddressLine1: this.props.ShippingAddressLine1,
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
                ShippingName: true,
                ShippingAddressLine1: false,
                ShippingAddressLine2: true,
                ShippingCity: false,
                ShippingRegion: false,
                ShippingZip: false,
                ShippingCountry: false
            },
            canSubmit: false,
            showSaveButton:false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAddressSubmit = this.handleAddressSubmit.bind(this);
        this.validateField = this.validateField.bind(this);
    }

    handleAddressSubmit = async e => {
        e.preventDefault();

        const {ShippingAddressLine1, ShippingName, ShippingAddressLine2, ShippingCity, ShippingRegion, ShippingZip, ShippingCountry} = this.state;

        let variables = {
            jwt_token: sessionStorage.getItem("jwtToken"),
            TimezoneOffset_M: new Date().getTimezoneOffset(),
            ShippingCountry: ShippingCountry,
            ShippingMethod: "AddressDelivery",
            ShippingCurrency: this.props.ShippingCurrency
        };
        let fetchShippingCost = fetchData(variables, ShippingCost_QUERY);
        variables = {
            jwt_token: sessionStorage.getItem("jwtToken"),
            timezoneOffset_M: new Date().getTimezoneOffset(),
            shippingCountry: ShippingCountry,
            shippingMethod: "AddressDelivery"
        };


        let fetchDeliveryEstimate = fetchData(variables,orderDeliveryEstimate_QUERY);
        let shippingCostFromDB = await fetchShippingCost;

        if (shippingCostFromDB !== null) {
            const shippingCost = shippingCostFromDB.DeliveryCost;
            this.props.ShippingCostSelected(
                ShippingName,
                ShippingAddressLine1,
                ShippingAddressLine2,
                ShippingCity,
                ShippingRegion,
                ShippingZip,
                ShippingCountry,
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
            let deliveryEstimate = new Date();
            deliveryEstimate.setTime(deliveryEstimateFromDB.orderDeliveryEstimate.deliveryTime);
            this.props.DeliveryEstimateSelected(
                deliveryEstimate
            );
        }
        this.setState({showSaveButton:false});
    };

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value,
            showSaveButton:false
        }, function () {
            this.validateField(name, value)
        })
    }

    validateField(name, value) {
        const isShippingAddressLine2 = name === "ShippingAddressLine2";
        const fieldValidationErrors = this.state.formErrors;
        const validity = this.state.formValidity;

        const zipTest = /^[0-9]{5}(?:-[0-9]{4})?$/;

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
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Shipping names length should be greater than 4`);
                } else if (name === "ShippingAddressLine1") {
                    // fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                } else if (name === "ShippingCity") {
                    // fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                } else if (name === "ShippingRegion") {
                    // fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} length should be 1 characters or more`);
                } else if (name === "ShippingZip") {
                    validity[name] = zipTest.test(value);
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Please enter a valid ZIP address`);
                } else if (name === "ShippingCountry") {
                    validity[name] = false;
                    const countries = countryList().getData();
                    for (let i = 0; i < countryList().getData().length; i++) {
                        const singleCountry = countries[i];
                        if (singleCountry.label === value) {
                            validity[name] = true;
                            break;
                        }
                    }
                    fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Please enter a real country`);
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
        const canSubmit = ShippingName && ShippingAddressLine1 && ShippingAddressLine2 && ShippingCity && ShippingRegion && ShippingZip && ShippingCountry;
        this.setState({
            canSubmit: canSubmit,
            showSaveButton:canSubmit,
        });
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'is-invalid');
    }

    renderForm() {
        let {ShippingName, ShippingAddressLine1, ShippingAddressLine2, ShippingCity, ShippingRegion, ShippingZip, ShippingCountry, canSubmit,showSaveButton} = this.state;
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
                            autoComplete="on"
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
                                        autoComplete="on"
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
                                        autoComplete="on"
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
                                        autoComplete="on"
                                        placeholder="Zip/Postal code"
                                        value={ShippingZip}
                                        onChange={this.handleChange}
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
                                        autoComplete="on"
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
                                        autoComplete="on"
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
                                        autoComplete="on"
                                        placeholder="Country"
                                        value={ShippingCountry}
                                        onChange={this.handleChange}
                                    />
                                    <div
                                        className="invalid-feedback">{this.state.formErrors.ShippingCountry}</div>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <Form.Item>
                        {(showSaveButton === true) ?
                            <button disabled={!canSubmit} className="site-btn submit-order-btn" type="submit">
                                Save your shipping address
                            </button> : <p/>}
                    </Form.Item>
                </Form>
            </div>
        );
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
                {this.renderForm()}
            </React.Fragment>
        );
    }
}