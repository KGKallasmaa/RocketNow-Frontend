import React, {Fragment} from 'react';
import gql from "graphql-tag";
import {Query} from "react-apollo";
import {Skeleton} from 'antd';
import {Image} from 'cloudinary-react';


const WAREHOUSE_QUERY = gql`
    query getAllMyListedGoods($jwt_token: String!) {
        getAllMyListedGoods(jwt_token: $jwt_token) {
            _id
            title
            current_price
            listing_timestamp
            quantity
            currency
            main_image_cloudinary_public_id
        }
    }
`;

let GLOBAL_enumerator = 0;

function renderResults(good) {
    //TODO: remove const variables  #performance
    const title = good.title;

    const main_image = good.main_image_cloudinary_public_id;

    let currentDate = new Date(Number(good.listing_timestamp));
    const date = currentDate.getDate();
    let month = currentDate.getMonth(); //Be careful! January is 0 not 1
    const year = currentDate.getFullYear();

    const listing_date = date + "." + (month + 1) + "." + year;


    const currency = good.currency;
    const quantity = good.quantity;
    const price = good.current_price;


    const product_url = "/goods/" + title + "/" + good._id;

    /*
    Row structure
    1. Image
    2. Listing date
    3. Title
    4. Quantity
    5. Price
     */
    const empty_or_regular = (quantity === 0) ? "table-danger" : 0;

    GLOBAL_enumerator += 1;
    return (
        <tr className={empty_or_regular}>
            <th scope="row">{GLOBAL_enumerator}</th>
            <td><Image secure="true" cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME} publicId={main_image}
                       width="60" crop="scale"/></td>
            <td>{listing_date}</td>
            <td><a href={product_url}>{title}</a></td>
            <td>{quantity}</td>
            <td>{price}</td>
            <td>{currency}</td>
        </tr>
    );
}

export default class Warehouse extends React.Component {
    state = {
        collapsed: false,
        key: 1
    };

    render() {
        const jwt_token = sessionStorage.getItem("business_jwtToken");
        return (
            <div>
                <h1>Here are all the items that you currently sell </h1>
                <p>TODO info about the table (e.g) number of items in total</p>
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Main image</th>
                        <th scope="col">Listing date</th>
                        <th scope="col">Title</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                        <th scope="col">Currency</th>
                    </tr>
                    </thead>
                    <tbody>
                    <Fragment>
                        <Query query={WAREHOUSE_QUERY} variables={{jwt_token}}>
                            {({data, loading, error}) => {
                                if (loading) return <Skeleton loading={true} active/>;
                                if (error) console.log(error);
                                if (data) {
                                    return data.getAllMyListedGoods.map(renderResults);
                                }
                            }
                            }
                        </Query>
                    </Fragment>
                    </tbody>
                </table>
            </div>
        );
    }
}
