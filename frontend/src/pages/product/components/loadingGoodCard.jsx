import React from "react";
import {AddToCart} from "../../../components/modifyCart.jsx";
import {Skeleton} from 'antd';
import 'antd/es/skeleton/style/css';

export class LoadingGoodCard extends React.PureComponent {
    render() {
        if (this.props.good === undefined) {
            return (
                <React.Fragment>
                    <div className="page-top-info">
                        <div className="container">
                            <h4><Skeleton rows={1} active={true}/></h4>
                            <div className="site-pagination">
                                <a title={"Home page"} href="/">Home</a> /
                                <Skeleton rows={1} active={true}/>
                            </div>
                        </div>
                    </div>
                    <section className="product-section">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="product-pic-zoom">
                                        <Skeleton rows={0} active={true} avatar={true}/>
                                    </div>
                                    <Skeleton rows={0} active={true} avatar={true}/>
                                    <Skeleton rows={0} active={true} avatar={true}/>
                                    <Skeleton rows={0} active={true} avatar={true}/>
                                </div>
                                <div className="col-lg-6 product-details">
                                    <Skeleton rows={3} active={true}/>
                                    <div className="quantity">
                                        <p>Quantity</p>
                                        <div className="pro-qty"
                                             aria-label={"Select how many goods you want to add to your cart"}>
                                            <input aria-label={"Select product quantity"}
                                                   type="text" value="1"/>
                                        </div>
                                    </div>
                                    <AddToCart good_id={undefined} title={undefined} quantity={1}/>
                                    <div id="accordion" className="accordion-area">
                                        <div className="panel">
                                            <div className="panel-header" id="headingOne">
                                                <button className="panel-link active" data-toggle="collapse"
                                                        data-target="#collapse1" aria-expanded="true"
                                                        aria-controls="collapse1">Description
                                                </button>
                                            </div>
                                            <div id="collapse1" className="collapse show" aria-labelledby="headingOne"
                                                 data-parent="#accordion">
                                                <div className="panel-body">
                                                    <Skeleton rows={15} active={true}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel">
                                            <div className="panel-header" id="headingTwo">
                                                <button className="panel-link" data-toggle="collapse"
                                                        data-target="#collapse2" aria-expanded="false"
                                                        aria-controls="collapse2">Product details
                                                </button>
                                            </div>
                                            <div id="collapse2" className="collapse" aria-labelledby="headingTwo"
                                                 data-parent="#accordion">
                                                <div className="panel-body">
                                                    <Skeleton rows={5} active={true}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel">
                                            <div className="panel-header" id="headingThree">
                                                <button className="panel-link" data-toggle="collapse"
                                                        data-target="#collapse3" aria-expanded="false"
                                                        aria-controls="collapse3">shipping & Delivery
                                                </button>
                                            </div>
                                            <div id="collapse3" className="collapse" aria-labelledby="headingThree"
                                                 data-parent="#accordion">
                                                <div className="panel-body">
                                                    <Skeleton rows={2} active={true}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="social-sharing">
                                        <a aria-label={"Share on Facebook"} title={"faceBookUrlText"}
                                           href="#"><i className="fa fa-facebook"/></a>
                                        <a aria-label={"Share on Twitter"} title={"twitterUrlText"}
                                           href="#"><i className="fa fa-twitter"/></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </React.Fragment>
            );
        }
        return null;
    }
}

const recommendStyle = {maxWidth: "100%"};

export class LoadingReccomendationGoodCard extends React.PureComponent {
    render() {
        if (this.props.good === undefined) {
            return (
                <React.Fragment>
                    <div className="col-sm-6 col-md-5 col-lg-4 item">
                        <div className="box" style={recommendStyle}>
                            <Skeleton rows={1} active={true}/>
                            <Skeleton rows={0} active={true} avatar={true}/>
                            <br/>
                            <Skeleton active={true}/>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-5 col-lg-4 item">
                        <div className="box" style={recommendStyle}>
                            <Skeleton rows={1} active={true}/>
                            <Skeleton rows={0} active={true} avatar={true}/>
                            <br/>
                            <Skeleton active={true}/>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-5 col-lg-4 item">
                        <div className="box" style={recommendStyle}>
                            <Skeleton rows={1} active={true}/>
                            <Skeleton rows={0} active={true} avatar={true}/>
                            <br/>
                            <Skeleton active={true}/>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
        return null;
    }

}