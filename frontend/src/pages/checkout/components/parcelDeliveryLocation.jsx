import Emoji from "react-emoji-render";
import React from "react";
import {Select, Skeleton} from "antd";
import 'antd/es/select/style/css';
import 'antd/es/skeleton/style/css';

import {isRegularUserLoggedIn} from "../../../components/authentication";
import {getEmoji} from "../../../components/emoji";
import {ShippingCost_QUERY} from "../../../graphql/shippingCost_QUERY";
import {orderDeliveryEstimate_QUERY} from "../graphql/orderDeliveryEstimate_QUERY";
import {ShippingLocations_QUERY} from "../../../graphql/parcelLocations_QUERY";
import {fetchData} from "../../../components/fetcher";


const {Option, OptGroup} = Select;

function arraysEqual(arr1, arr2) {
    if (arr1 === undefined && arr2 === undefined) {
        return true;
    }
    if (arr1 === undefined || arr2 === undefined) {
        return false;
    }
    if (arr1.length !== arr2.length)
        return false;
    for (let i = arr1.length; i--;) {
        if (arr1[i].props.value.toString() !== arr2[i].props.value.toString()) {
            return false;
        }
    }
    return true;
};

export class ParcelDeliveryLocationForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            OtherLocations: [],
            NearestLocations: [],
            loadingParcelLocations: true,
            ShippingName: this.props.ShippingName,
        };
        this.getMyLocation();
        this.handleChange = this.handleChange.bind(this);
        this.getParcellLocations = this.getParcellLocations.bind(this);
        this.setShippingName = this.setShippingName.bind(this);
    };


    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.state.loadingParcelLocations !== nextState.loadingParcelLocations) {
            return true;
        }
        if (this.props.ParcelDeliveryLocation === undefined) {
            return true;
        }
        if (this.props.ParcelDeliveryLocation === nextProps.ParcelDeliveryLocation) {
            return false;
        }
        const otherLocationsAreEqual = arraysEqual(this.state.OtherLocations, nextState.OtherLocations);
        if (!otherLocationsAreEqual) {
            return true;
        }
        const nearestLocationsAreEqual = arraysEqual(this.state.NearestLocations, nextState.NearestLocations);
        return !nearestLocationsAreEqual;
    }

    async handleChange(value) {
        const response = value.split(",");
        const ParcelDeliveryLocationCountry = response[0];
        const ParcelDeliveryLocationName = response[1];
        const ParcelDeliveryLocation = response[2];

        let variables = {
            jwt_token: (isRegularUserLoggedIn()) ? sessionStorage.getItem("jwtToken") : sessionStorage.getItem("temporary_user_id"),
            ParcelDeliveryLocation: ParcelDeliveryLocation,
            TimezoneOffset_M: new Date().getTimezoneOffset(),
            ShippingMethod: "ParcelDelivery",
            ShippingCurrency: this.props.ShippingCurrency
        };

        let fetchShippingCost = fetchData(variables, ShippingCost_QUERY);

        variables = {
            jwt_token: (isRegularUserLoggedIn()) ? sessionStorage.getItem("jwtToken") : sessionStorage.getItem("temporary_user_id"),
            timezoneOffset_M: new Date().getTimezoneOffset(),
            shippingCountry: ParcelDeliveryLocationCountry,
            shippingMethod: "ParcelDelivery",
        };


        let fetchDeliveryEstimate = fetchData(variables, orderDeliveryEstimate_QUERY);
        let shippingCostFromDB = await fetchShippingCost;


        if (shippingCostFromDB !== null) {
            const shippingCost = shippingCostFromDB.DeliveryCost;
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
                shippingCost,
                ParcelDeliveryLocation,
                ParcelDeliveryLocationName,
                ParcelDeliveryLocationCountry,
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
    };

    setShippingName(event) {
        this.setState({
            ShippingName: event.target.value
        });
    }

    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation;
        if (location) {
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
        const variables = {
            UserLatCoordinate: MyLatitude,
            UserLonCoordinate: MyLongitude
        };

        let fetchParcelLocation = fetchData(variables, ShippingLocations_QUERY);
        let parcelLocationsFromDB = await fetchParcelLocation;

        if (parcelLocationsFromDB !== null) {
            const nearestLocations = (MyLatitude !== 0 && MyLongitude !== 0) ? parcelLocationsFromDB.ParcelDeliveryLocations.slice(0, 5) : [];
            const otherLocations = (MyLatitude !== 0 && MyLongitude !== 0) ? parcelLocationsFromDB.ParcelDeliveryLocations.slice(5, parcelLocationsFromDB.ParcelDeliveryLocations.length) : parcelLocationsFromDB.ParcelDeliveryLocations;

            if (nearestLocations && otherLocations) {
                this.setState({
                    NearestLocations: nearestLocations.map(location => (
                        <Option value={location.country + "," + location.name + "," + location._id}
                        >{getEmoji(location.provider)}{location.name}</Option>)),
                    OtherLocations: otherLocations.map(location => (
                        <Option value={location.country + "," + location.name + "," + location._id}
                        >{getEmoji(location.provider)}{location.name}</Option>)),
                    loadingParcelLocations: false,
                })
            } else {
                this.setState({
                    OtherLocations: otherLocations.map(location => (
                        <Option value={location.country + "," + location.name + "," + location._id}
                        >{getEmoji(location.provider)}{location.name}</Option>)),
                    loadingParcelLocations: false,
                })
            }
        }
    }

    render() {
        if (this.props.disabled === true) {
            return (<div/>);
        }
        const {NearestLocations, OtherLocations, loadingParcelLocations} = this.state;
        if (loadingParcelLocations === true) {
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
                                    <Skeleton active={true} rows={3}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
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