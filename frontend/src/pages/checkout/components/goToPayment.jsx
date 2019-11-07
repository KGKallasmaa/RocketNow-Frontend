import React from "react";
import {Icon, Skeleton} from "antd";
import {CHECKOUT_MUTATION} from "../../../graphql/checkout_MUTATION";
import {fetchData} from "../../../components/fetcher";

const loadingIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

export class GoToPayment extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            stripe: this.props.stripe,
            weHaveStripe: false,
            IsLoading: true,
        };
        this.goToCheckout = this.goToCheckout.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.weHaveStripe !== nextState.weHaveStripe;
    }

    componentDidMount() {
        if (window.Stripe) {
            this.setState({
                stripe: window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY),
                weHaveStripe: true,
                IsLoading: false
            });
        } else {
            document.querySelector('#stripe-js').addEventListener('load', () => {
                this.setState({
                    stripe: window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY),
                    weHaveStripe: true,
                    IsLoading: false
                });
            });
        }
    }

    async goToCheckout() {
        this.setState({IsLoading: true});
        const variables = {
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
            deliveryEstimate_UTC: this.props.deliveryEstimate_UTC.toISOString(),
            TimezoneOffset_M: this.props.TimezoneOffset_M,
            totalCost: this.props.taxCost + this.props.ShippingCost + this.props.orderSubtotal
        };
        let fetchStripeId = fetchData(variables, CHECKOUT_MUTATION);
        let StripeIdFromDB = await fetchStripeId;
        if (StripeIdFromDB !== null) {
            this.state.stripe.redirectToCheckout({sessionId: StripeIdFromDB.showCheckout.sessionId});
        }
        this.setState({IsLoading: false});
    };

    render() {
        let {IsLoading, weHaveStripe} = this.state;
        if (IsLoading === true && weHaveStripe === false) {
            return (
                <Skeleton loading={true}>
                    <button disabled={this.props.disabled}
                            className="site-btn submit-order-btn"
                            onClick={this.goToCheckout}>
                    </button>
                </Skeleton>
            );
        }
        return (
            <div className="container">
                <button disabled={this.props.disabled}
                        className="site-btn submit-order-btn"
                        onClick={this.goToCheckout}>
                    {(IsLoading === true) ? loadingIcon : ""}
                    {(IsLoading === false) ? "Proceed to Payment" : ""}
                </button>
            </div>
        );
    }
}