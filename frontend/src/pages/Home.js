import React from 'react';
import {Card, Carousel, Col, Icon, Layout, Row} from 'antd';
import PageNavbar from './navbar_and_footer/PageNavbar';
import PageFooter from './navbar_and_footer/PageFooter';
import '../style/Navbar.css';

//todo: example pictures. Remove later
import cathegory_example_pic from '../style/example-pics/CathegoryExample.png';
import recommend_example_pic from '../style/example-pics/ReccomendExample.png';
import trending_example_pic from '../style/example-pics/TrendingExample.png';
import {Helmet} from "react-helmet";

const axios = require("axios");

const card_style = {
    padding: '15px',
    paddingtop: '15px',
    paddingright: '0px',
    paddingbottom: '0px',
    paddingleft: '0px'
};
const menu_style = {
    padding: '10px',
    paddingtop: '15px',
    paddingright: '0px',
    paddingbottom: '0px',
    paddingleft: '0px'
};
const trending_style = {
    padding: "10px",
    paddingtop: "15px",
    paddingright: '0px',
    paddingbottom: '0px',
    paddingleft: '0px'
};
const img_width = {
    width: "100%"
};
const card_width = {
    width: "100%"
};


const {Meta} = Card;

const TrendingGoodCard = (props) => {
    return (
        <Card
            hoverable
            style={{width: 300}}
            cover={<img alt="example" src={trending_example_pic}/>}
            actions={[
                <Icon type="like"/>
                ,
                <Icon type="shopping-cart"/>
                ,
                <Icon type="dislike"/>
            ]}
        >
            <Meta
                title="Europe Street beat"
                description="www.instagram.com"
            />
        </Card>
    )
};

const RecommendGoodCard = (props) => {
    return (
        <Card
            hoverable
            style={{width: 300}}
            cover={<img alt="example" src={recommend_example_pic}/>}
            actions={[
                <Icon type="like"/>
                ,
                <Icon type="shopping-cart"/>
                ,
                <Icon type="dislike"/>
            ]}
        >
            <Meta
                title="Europe Street beat"
                description="www.instagram.com"
            />
        </Card>
    )
};

const CathegoryCard = (props) => {
    return (
        <Card
            hoverable
            style={{width: 300}}

            cover={<img alt="Cathgoory example pic" src={cathegory_example_pic}/>}
        >
        </Card>
    )
};


//TODO dublicate

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect_to_business: false
        };
        if (sessionStorage.getItem('business_jwtToken')) {
            this.setState({
                redirect_to_business: true
            });
        }
    }
    render() {
        const cannonial_url = process.env.REACT_APP_CLIENT_URL;
        return (
            <div>
                <PageNavbar token={this.props.token}/>
                <Helmet>
                    <link rel="canonial" href={cannonial_url}/>
                    <title>NoNoLine: Online Shopping for Goods and Services</title>
                    <meta name="description" content="A please for numerous goods and services."/>
                    <meta name="keywords" content="NoNoLine,NoNoLine.com,Goods,Services"/>
                </Helmet>
                <RegularHome/>
                <PageFooter/>
            </div>
        );
    }
}

class RegularHome extends React.Component {
    render() {
        return (
            <div>
                <br/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-1">
                        </div>
                        <div className="col-md-10">
                            <Carousel autoplay>
                                <div><img className="d-block w-100" alt="Carousel Bootstrap I"
                                          src="https://www.layoutit.com/img/sports-q-c-1600-500-1.jpg"/></div>
                                <div><img className="d-block w-100" alt="Carousel Bootstrap II"
                                          src="https://www.layoutit.com/img/sports-q-c-1600-500-2.jpg"/></div>
                                <div><img className="d-block w-100" alt="Carousel Bootstrap III"
                                          src="https://www.layoutit.com/img/sports-q-c-1600-500-3.jpg"/></div>
                                <div><img className="d-block w-100" alt="Carousel Bootstrap IV"
                                          src="https://www.layoutit.com/img/sports-q-c-1600-500-1.jpg"/></div>
                                <div><img className="d-block w-100" alt="Carousel Bootstrap V"
                                          src="https://www.layoutit.com/img/sports-q-c-1600-500-2.jpg"/></div>
                            </Carousel>
                        </div>
                        <div className="col-md-1">
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-1">
                        </div>
                        <div className="col-md-10">
                            <h3>
                                Trending in Estonia
                            </h3>
                            <div style={{padding: '10px'}}>
                                <Row gutter={25}>
                                    <Col span={4}>
                                        <TrendingGoodCard/>
                                    </Col>
                                    <Col span={4}>
                                        <TrendingGoodCard/>
                                    </Col>
                                    <Col span={4}>
                                        <TrendingGoodCard/>
                                    </Col>
                                    <Col span={4}>
                                        <TrendingGoodCard/>
                                    </Col>
                                    <Col span={4}>
                                        <TrendingGoodCard/>
                                    </Col>
                                    <Col span={4}>
                                        <TrendingGoodCard/>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className="col-md-1">
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <div className="row">
                        <div className="col-md-1">
                        </div>
                        <div className="col-md-10">
                            <h3>
                                Recommended for you
                            </h3>
                            <div style={{padding: '10px'}}>
                                <Row gutter={25}>
                                    <Col span={4}>
                                        <RecommendGoodCard/>
                                    </Col>
                                    <Col span={4}>
                                        <RecommendGoodCard/>
                                    </Col>
                                    <Col span={4}>
                                        <RecommendGoodCard/>
                                    </Col>
                                    <Col span={4}>
                                        <RecommendGoodCard/>
                                    </Col>
                                    <Col span={4}>
                                        <RecommendGoodCard/>
                                    </Col>
                                    <Col span={4}>
                                        <RecommendGoodCard/>
                                    </Col>
                                </Row>
                                <br/>
                                <br/>
                            </div>
                        </div>
                        <div className="col-md-1">
                        </div>
                    </div>
                </div>
                <br/>
                <br/>
            </div>
        )
    }
}