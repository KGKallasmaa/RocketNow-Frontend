import React, {lazy, Suspense} from "react";
import "../../assets/css/product.min.css"
import Footer from "../../components/footer";
import {Navbar} from "../../components/navbar";
import {product_QUERY} from "../../graphql/individualProduct_QUERY";
import {RECOMMEND_GOOD_QUERY} from "../../graphql/reccomendGood_QUERY";
import {fetchData} from "../../components/fetcher";
import {LoadingGoodCard, LoadingReccomendationGoodCard} from "./components/loadingGoodCard";
import {singleProductDeliveryEstimate_QUERY} from "./graphql/singleProductDeliveryEstimate_QUERY";
import AcceptsCookies from "../../components/legal/cookieConsent.jsx";


const RecommendationCard = lazy(() => import("./components/recommendationGoodCard.jsx"));
const RegularGoodCard = lazy(() => import("./components/regularGoodCard.jsx"));

function mapRecommendation(good) {
    return (
        <Suspense fallback={"Loading ..."}>
            <RecommendationCard good={good}/>
        </Suspense>
    );
}

function mapRegularGood(good, nr, parcelDeliveryEstimate, addressDeliveryEstimate) {
    return (
        <Suspense fallback={"Loading ..."}>
            <RegularGoodCard parcelDeliveryEstimate={parcelDeliveryEstimate}
                             addressDeliveryEstimate={addressDeliveryEstimate} good={good} nr={nr}/>
        </Suspense>
    );
}

function getMyLocation() {
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
        const positionOptions = {
            enableHighAccuracy: true, timeout: 20000, maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition((position) => {
            return [position.coords.latitude, position.coords.longitude];
        }, (error) => {
        }, positionOptions);
    }
    return [0.0, 0.0];
}

export default class ProductPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextState.rec !== undefined;
    }

    async componentDidMount() {
        const productQueryVariables = (sessionStorage.getItem("jwtToken") === null) ? {nr: parseInt(this.props.match.params.nr, 10)} : {
            nr: parseInt(this.props.match.params.nr, 10),
            jwt_token: sessionStorage.getItem("jwtToken")
        };
        const recVariables = (sessionStorage.getItem("jwtToken") === null) ? {nr: 3} : {
            nr: 3,
            jwt_token: sessionStorage.getItem("jwtToken")
        };
        let fetchProductData = fetchData(productQueryVariables, product_QUERY);
        let fetchReccomendationData = fetchData(recVariables, RECOMMEND_GOOD_QUERY);

        let productData = await fetchProductData;
        if (productData !== null) {
            this.setState({
                good: productData.individualGood,
            });
        }
        let recommendationData = await fetchReccomendationData;
        if (recommendationData !== null) {
            this.setState({
                rec: recommendationData.recommend
            });
        }
        const myCoOrdinates = getMyLocation();
        const variables = {
            good_id: this.state.good._id,
            quantity: 1,
            TimezoneOffset_M: new Date().getTimezoneOffset(),
            lat: myCoOrdinates[0],
            long: myCoOrdinates[1]
        };
        let fetchSingleProductDeliveryEstimate = fetchData(variables, singleProductDeliveryEstimate_QUERY);

        let deliveryEstimate = await fetchSingleProductDeliveryEstimate;
        if (deliveryEstimate !== null) {
            const raw = deliveryEstimate.singleProductDeliveryEstimate;
            const parcel = new Date();
            parcel.setTime(raw[0].deliveryTime);
            const address = new Date();
            address.setTime(raw[1].deliveryTime);
            this.setState({
                parcelDeliveryEstimate: parcel,
                addressDeliveryEstimate: new Date(address)
            });
        }
    };

    render() {
        const {good, rec, parcelDeliveryEstimate, addressDeliveryEstimate} = this.state;
        return (
            <React.Fragment>
                <Navbar/>
                <br/><br/>
                {(good !== undefined && parcelDeliveryEstimate !== undefined && addressDeliveryEstimate !== undefined) ? mapRegularGood(good, this.props.match.params.nr, parcelDeliveryEstimate, addressDeliveryEstimate) :
                    <p/>}
                <LoadingGoodCard good={good}/>
                <AcceptsCookies/>
                <div className="features-boxed">
                    < div className="container">
                        <div className="intro">
                            <h2 className="text-center"> You might like </h2>
                        </div>
                        <div className="row justify-content-center features">
                            {(rec !== undefined) ? rec.map(mapRecommendation) : <p/>}
                            <LoadingReccomendationGoodCard good={rec}/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
};