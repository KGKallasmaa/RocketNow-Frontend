import React from 'react';
import {fetchData} from "../../../common/fetcher";
import {UserCard_QUERY} from "../../../graphql/userCard_QUERY";
import {Table, Tag, Skeleton, Button, Empty, message} from 'antd';
import {formatTimeStamp} from "../../../components/relativeTimestamp";
import {getEmoji} from "../../../components/emoji";
import {Address_QUERY} from "../graphql/address_QUERY";
import {default_Address_MUTATION} from "../graphql/defaultAddress_MUTATION";
import {not_Active_Address_MUTATION} from "../graphql/notActiveAddress_MUTATION";
import noOrders from "../assets/img/noOrders.png";

const {Column} = Table;

function renderShippingAddress(shippingAddress) {
    if (shippingAddress === undefined) {
        return "";
    }
    if (shippingAddress.shippingMethod === "ParcelDelivery") {
        return (
            <div>
                <b>To:</b> {shippingAddress.shippingName} <br/>
                <b>Location:</b> {shippingAddress.parcelDeliveryLocation.name} {getEmoji(shippingAddress.parcelDeliveryLocation.country)}<br/>
                <b>Provider:</b> {shippingAddress.parcelDeliveryLocation.provider} <br/>
            </div>
        );
    } else if (shippingAddress.shippingMethod === "AddressDelivery") {
        const addressLine2 = (shippingAddress.addressTwo !== undefined) ? "-"+shippingAddress.addressTwo : "";
        return (
            <div>
                <b>To:</b> {shippingAddress.shippingName} <br/>
                <b>Address:</b> {shippingAddress.addressOne}{addressLine2} <br/>
                <b>City:</b> {shippingAddress.city} <br/>
                <b>Zip</b> {shippingAddress.zip} <br/>
                <b>Region</b> {shippingAddress.region} <br/>
                <b>Country</b> {shippingAddress.country}{getEmoji(shippingAddress.country)} <br/>
            </div>
        );
    }
}


function fetchAddressData(addresses) {
    let shippingLocations = [];
    let usedAddressDeliveryLocations = [];
    let usedParcelDeliveryLocations = [];
    let j = 0;
    addresses.sort(a => a.shippingAddress.isDefault ? -1 : 1);

    for (let i = 0; i < addresses.length; i++) {
        const singleOrder = addresses[i].shippingAddress;

        if (singleOrder.isActive === true) {
            let type = [singleOrder.shippingMethod];
            let locationIsUnique = true;

            if (singleOrder.isDefault) {
                type[0] = "Default";
            }

            if (singleOrder.shippingMethod === "AddressDelivery") {
                const string = singleOrder.addressOne + singleOrder.addressTwo + singleOrder.city + singleOrder.country + singleOrder.shippingName + singleOrder.zip;
                locationIsUnique = !usedAddressDeliveryLocations.includes(string);
                if (locationIsUnique) {
                    usedAddressDeliveryLocations.push(string);
                }
            } else if (singleOrder.shippingMethod === "ParcelDelivery") {
                const base = singleOrder.parcelDeliveryLocation;
                const string = base.country + base.name + base.provider + singleOrder.shippingName;
                locationIsUnique = !usedParcelDeliveryLocations.includes(string);
                if (locationIsUnique) {
                    usedParcelDeliveryLocations.push(string);
                }
            }
            if (locationIsUnique) {
                shippingLocations[j] = {
                    key: j + 1,
                    nr: j + 1 + ".",
                    location: [singleOrder],
                    type: type,
                };
                j += 1;
            }
        }
    }
    return shippingLocations;
}


async function makeAddressNotActive(event) {
    const variables = {
        jwt_token: sessionStorage.getItem("jwtToken"),
        location_id: event.target.value
    };
    let notActiveAddress = await fetchData(variables, not_Active_Address_MUTATION);
    if (notActiveAddress !== null) {
        if (notActiveAddress.makeAddressNotActive === true) {
            message.success("This location will not be shown");
        } else {
            message.error("Problem forgetting this location");
        }
    }
}

async function makeDefault(event) {
    const variables = {
        jwt_token: sessionStorage.getItem("jwtToken"),
        location_id: event.target.value
    };


    let defaultAddress = await fetchData(variables, default_Address_MUTATION);
    if (defaultAddress !== null) {
        if (defaultAddress.makeAddressDefault === true) {
            message.success('Default location set');
        } else {
            message.error('Default location was not set');
        }
    }
}


function renderTable(locations) {
    if (locations.length < 1) {
        return (
            <Empty image={noOrders}
                   imageStyle={{height: 180}}
                   description={
                       <span>No past delivery locations found</span>
                   }
            >
                <Button href={"/"} type="primary">Start shopping</Button>
            </Empty>
        );
    }
    let default_location_id = undefined;
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].type[0] === "Default") {
            default_location_id = locations[i].location[0]._id;
            break;
        }
    }
    return (
        <Table dataSource={locations}>
            <Column title="#" dataIndex="nr" key="nr"/>
            <Column title="Location" dataIndex="location" key="location"
                    render={location => (
                        <span>
                            {location.map(location => (
                                <div>
                                    {renderShippingAddress(location)}
                                </div>
                            ))}
                        </span>
                    )}
            />
            <Column title="Type" dataIndex="type" key="type"
                    render={type => (
                        <span>
                            {type.map(type => (
                                <Tag
                                    color={type === "Default" ? "red" : (type === "AddressDelivery" ? "blue" : "green")}
                                    key={type}>
                                    {type}
                                </Tag>
                            ))}
                        </span>
                    )}
            />
            <Column title="Action" dataIndex="location" key="location"
                    render={location => (
                        <span>
                            {location.map(location => (
                                <div>
                                    {(location._id !== default_location_id) ?
                                        <React.Fragment>
                                            <button value={location._id} onClick={makeDefault} type="button"
                                                    className="btn btn-outline-primary btn-sm">
                                                Default
                                            </button>
                                            &nbsp;&nbsp;
                                        </React.Fragment>
                                        : <p/>
                                    }


                                    <button value={location._id} onClick={makeAddressNotActive} type="button"
                                            className="btn btn-outline-danger btn-sm">
                                        Forget
                                    </button>
                                </div>
                            ))}
                        </span>
                    )}
            />
        </Table>
    );
}

function renderSkeletons() {
    return (
        <div>
            <Skeleton rows={3} loading={true} active avatar/>
            <hr/>
            <Skeleton rows={3} loading={true} active avatar/>
            <hr/>
            <Skeleton rows={3} loading={true} active avatar/>
            <hr/>
        </div>
    );
}


export class UserGeneralTab extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            individualUser: "",
            locationLoadingCompleted: false
        };
    }

    async componentDidMount() {
        const variables = {
            jwt_token: sessionStorage.getItem("jwtToken")
        };
        let fetchUserDetails = fetchData(variables, UserCard_QUERY);
        let fetchUserAddress = fetchData(variables, Address_QUERY);

        let userDetails = await fetchUserDetails;
        let userAddress = await fetchUserAddress;

        if (userAddress !== null && userDetails != null) {
            this.setState({
                individualUser: userDetails.individualUser,
                locations: fetchAddressData(userAddress.individualOrder),
                locationLoadingCompleted: true
            });
        }
    }

    render() {
        const {individualUser, locations, locationLoadingCompleted} = this.state;
        return (
            <React.Fragment>
                <h3>General information</h3>
                <div className="team-boxed">
                    <div className="container">
                        <div className="intro"/>
                        <div className="row people">
                            <div className="col-xl-1"/>
                            <div className="col-md-6 col-lg-4 col-xl-10 item">
                                <div className="box">
                                    <img alt={this.props.userName} className="rounded-circle"
                                         src={sessionStorage.getItem("regularUserImageURL")}/>
                                    <br/>
                                    <p className="title">Joined {formatTimeStamp(individualUser.signupTimestamp_UNIX)}</p>
                                    <p className="description">Email: karl.gustav1789@gmail.com</p>
                                </div>
                            </div>
                            <div className="col-xl-1"/>
                        </div>
                    </div>
                </div>
                <h3>Delivery locations</h3>
                {locationLoadingCompleted === true ? renderTable(locations) : renderSkeletons()}
            </React.Fragment>
        );
    };
}