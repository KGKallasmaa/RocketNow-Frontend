import React, {lazy, Suspense} from "react";
import "../../assets/css/product.min.css"
import Footer from "../../components/footer";
import {Navbar} from "../../components/navbar";
import {product_QUERY} from "../../graphql/individualProduct_QUERY";
import {RECOMMEND_GOOD_QUERY} from "../../graphql/reccomendGood_QUERY";
import {fetchData} from "../../common/fetcher";
import {LoadingGoodCard,LoadingReccomendationGoodCard} from "./components/loadingGoodCard";

const RecommendationCard = lazy(() => import("./components/recommendationGoodCard.jsx"));
const RegularGoodCard = lazy(() => import("./components/regularGoodCard.jsx"));

function mapRecommendation(good) {
    return (
        <Suspense fallback={"Loading ..."}>
            <RecommendationCard good={good}/>
        </Suspense>
    );
}
function mapRegularGood(good,nr) {
    return (
        <Suspense fallback={"Loading ..."}>
            <RegularGoodCard good={good} nr={nr}/>
        </Suspense>
    );
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
                good:productData.individualGood,
            });
        }
        let recommendationData = await fetchReccomendationData;
        if (recommendationData !== null) {
            this.setState({
                rec: recommendationData.recommend
            });
        }
    }


    render() {
        const {good,rec} = this.state;
        return (
            <React.Fragment>
                <Navbar/>
                <br/><br/>
                {(good !== undefined) ? mapRegularGood(good,this.props.match.params.nr) : <p/>}
                <LoadingGoodCard good={good}/>
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