import React, {Fragment} from "react";
import gql from "graphql-tag";
import {Query} from "react-apollo";
import {Col, Icon, Row, Skeleton, Steps, Carousel, Avatar, Button, Card} from "antd";
import {Helmet} from "react-helmet";
import PageFooter from "../navbar_and_footer/PageFooter";
import PageNavbar from "../navbar_and_footer/PageNavbar";

const {Meta} = Card;
const {Step} = Steps;

const Order_QUERY = gql`
    query orderGoods($jwt_token: String!,$success_id:String!) {
        orderGoods(orderInput:{jwt_token: $jwt_token,success_id:$success_id}) {
            order_items{
                _id
                title
                main_image_cloudinary_secure_url
            }
        }
    }
`;


const OrderGoodCard = (props) => {
    let actions = [<Icon type="facebook"/>, <Icon type="share-alt"/>, <Icon type="instagram"/>];
    if (props.loading === true) {
        return (
            <Card
                style={{width: 300, marginTop: 16}}
                actions={actions}
            >
                <Skeleton loading={props.loading} avatar active>
                    <Meta
                        avatar={
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                        }
                        title="Card title"
                        description="This is the description"
                    />
                </Skeleton>
            </Card>
        );
    }

    const GoodUrl = process.env.REACT_APP_PUBLIC_URL + "/goods/" + props.id;

    const fbShareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + GoodUrl;
    const InstagramShareUrl = "https://www.instagram.com/?url=" + GoodUrl;
    //TODO: I want to go to the goods page
    const emailShareUrl = "mailto:?subject=Found a cool product on RocketNow&amp;body=Check it out" + props.title + "on RocketNow" + GoodUrl;


    actions = [<Button type="link" onClick={() => window.open(fbShareUrl, "_blank")} icon="facebook"/>,
        <Button type="link" onClick={() => window.open(emailShareUrl, "_blank")} icon="share-alt"/>,
        <Button type="link" onClick={() => window.open(InstagramShareUrl, "_blank")} icon="instagram"/>];

    return (
        <div>
            <Card
                hoverable
                style={{width: 300, height: 400}}
                cover={<img alt={props.title} src={props.image} style={{height: 400}}/>}
                actions={actions}
            >
                <Meta
                    title={props.title}
                />
            </Card>
        </div>
    )
};

const ReccomenationGoodCard = (props) => {
    const img_url = "https://res.cloudinary.com/dl7zea2jd/image/upload/v1559896308/good_pictures/51OZerWcGCL_myhhgi.jpg";
    const name = "Rec name";
    const demo_url = "dest url";

    return (
        <Card
            hoverable
            style={{width: 200, height: 200}}
            cover={<img alt="example" src={img_url}/>}
        >
        </Card>
    )
};


export default class Success extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        };
        this.LoadingCards = this.LoadingCards.bind(this);
    }

    LoadingCards() {
        return (
            <div style={{padding: '10px'}}>
                <Row gutter={25}>
                    <Col span={4}>
                        <OrderGoodCard loading={true}/>
                    </Col>
                    <Col span={4}>
                        <OrderGoodCard loading={true}/>
                    </Col>
                    <Col span={4}>
                        <OrderGoodCard loading={true}/>
                    </Col>
                </Row>
                <br/>
                <br/>
            </div>
        );
    }


    getReccomenations() {
//TODO: develop
        return (
            <Carousel afterChange={this.onChange}>
                <div>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                </div>
                <div>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                </div>
                <div>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                </div>
                <div>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                    <Col span={3}>
                        <ReccomenationGoodCard/>
                    </Col>
                </div>
            </Carousel>
        );
    }

    handleChange(event) {
        event.preventDefault();
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        const jwt_token = sessionStorage.getItem("jwtToken");
        const success_id = this.props.match.params.success_id;

        //SEO
        const CannonialUrl = process.env.REACT_APP_CLIENT_URL + "/success/" + success_id;
        const Keywords = ["RocketNow", "Shopping", "E-commerce", "Success", "Order"];
        return (
            <div className="container-fluid">
                <PageNavbar/>
                <Helmet>
                    <title>Thank you from RocketNow</title>
                    <meta name="keywords" content={Keywords}/>
                    <link rel="canonial" href={CannonialUrl}/>
                </Helmet>
                <br/> <br/> <br/>
                <div className="row">
                    <div className="col-md-2">
                        <Steps direction="vertical" current={1} status="finish" size="default">
                            <Step title="Payment"/>
                            <Step title="Processed" icon={<Icon type="loading"/>}/>
                            <Step title="Shipped" icon={<Icon type="rocket"/>}/>
                            <Step title="Delivered" icon={<Icon type="smile"/>}/>
                        </Steps>
                    </div>
                    <div className="col-md-10">
                        <h2><b>Thank you for ordering</b></h2>
                        <Fragment>
                            <Query query={Order_QUERY} variables={{jwt_token, success_id}}>
                                {({data, loading, error}) => {
                                    if (loading) return this.LoadingCards();
                                    if (error) console.log(error);
                                    if (data) {
                                        const NrOfGoods = data.orderGoods.order_items.length;
                                        let allGoods = data.orderGoods.order_items;

                                        let ShowableGoods = (allGoods.length === 1) ? allGoods : allGoods.filter((allGoods, idx) => idx < 3);

                                        const dif = NrOfGoods - ShowableGoods.length;
                                        const GoodOrGoods = (dif === 1) ? " good" : "goods";
                                        const MoreGoodsMessage = (dif === 0) ? "" : "+" + dif + " other " + GoodOrGoods;

                                        const ColumnSize = 12 / ShowableGoods.length;

                                        const GoodsInColumns = ShowableGoods.map(good => {
                                            const Title = good.title;
                                            const Id = good._id;
                                            const ImageURL = good.main_image_cloudinary_secure_url;
                                            return (
                                                <div>
                                                    <Col span={ColumnSize}>
                                                        <OrderGoodCard id={Id} title={Title} image={ImageURL}/>
                                                    </Col>
                                                </div>
                                            )
                                        });
                                        return (
                                            <div style={{padding: '10px'}}>
                                                <Row gutter={25}>
                                                    {GoodsInColumns}
                                                    <br/>
                                                    <h1>{MoreGoodsMessage}</h1>
                                                </Row>
                                            </div>
                                        );
                                    }
                                }
                                }
                            </Query>
                        </Fragment>
                    </div>
                </div>
                <br/> <br/> <br/> <br/> <br/> <br/>
                <br/>
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-10">
                        <h4><b>You should also consider</b></h4>
                        <br/>
                        {this.getReccomenations()}
                    </div>
                </div>
                <br/>
                <br/>
                <PageFooter/>
            </div>
        );
    }
}