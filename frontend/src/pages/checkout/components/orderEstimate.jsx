import React from "react";
import {formatTimeStamp} from "../../../components/relativeTimestamp";


export class OrderEstimateForm extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.ShippingEstimatedDeliveryTime !== undefined;
    }
    render() {
        if (this.props.ShippingEstimatedDeliveryTime === undefined) {
            return (<div/>);
        }
        return (
            <div className="container">
                <div className="row shipping-btns">
                    <div className="col-6">
                        <h4> Estimated arrival time</h4>
                    </div>
                    <div className="col-6">
                        <h4>
                            <b>
                                {formatTimeStamp(this.props.ShippingEstimatedDeliveryTime)}
                            </b>
                        </h4>
                    </div>
                </div>
            </div>
        );
    }
}