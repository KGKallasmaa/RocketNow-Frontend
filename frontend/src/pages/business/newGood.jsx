import React from "react";
import Menu from "./common/menu";
import "../../assets/css/business/admin.min.css";
import axios from "axios";
import {print} from "graphql";
import {message, Spin} from "antd";
import BusinessNavbar from "./common/navbar";
import BusinessFooter from "./common/footer";
import {Tabs, Icon} from 'antd';
import PhysicalGoodForm from "./newGood/newPhysicalGood";
import {currency_symbol_converter} from "../../components/currency_and_symbol";
import {NEW_PHYSICAL_GOOD_MUTATION} from "../../graphql/businessuser/newProduct/addNewPhysicalProduct_MUTATION";
import {Helmet} from "react-helmet";

const {TabPane} = Tabs;
const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

const category_and_tax = {
    "Music": 0.2,
    "Books": 0.09,
    "Pet Supplies": 0.2,
    "Sports and Outdoors": 0.2,
    "Baby": 0.2,
    "Automotive": 0.2,
    "Arts and Crafts": 0.2,
    "Beauty and Personal Care": 0.2,
    "Computers": 0.2,
    "Electronics": 0.2,
    "Women's Fashion": 0.2,
    "Men's Fashion": 0.2,
    "Girls' Fashion": 0.2,
    "Boys' Fashion": 0.2,
    "Health and Household": 0.2,
    "Home and Kitchen": 0.2,
    "Industrial and Scientific": 0.2,
    "Luggage": 0.2,
    "Movies and Television": 0.2,
    "Software": 0.2,
    "Tools and Home Improvement": 0.2,
    "Toys and Games": 0.2,
    "Video Games": 0.2,
    "Groceries and Gourmet Food": 0.2,
};

async function UploadImages(files) {
    let return_dictionary = {};

    let data = new FormData();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        data.append("GoodImageFile", file);
    }

    const config = {
        headers: {'content-type': 'multipart/form-data'}
    };
    const response = await axios.post(process.env.REACT_APP_IMAGE_UPLOAD_URL, data, config);
    let secure_url_array = Array();
    for (let index = 0; index < response.data.length; index++) {
        const original_secure_url_element = response.data[index].secure_url;
        secure_url_array.push(original_secure_url_element);
    }
    return_dictionary["secure_url"] = secure_url_array;
    return return_dictionary
}

async function AddNewGood(title,
                          description,
                          listing_price,
                          quantity,
                          currency,
                          general_category,
                          main_image_cloudinary_secure_url, other_images_cloudinary_secure_url,
                          height_mm, length_mm, width_mm, weight_g,
                          custom_attribute_1_name, custom_attribute_1_value,
                          custom_attribute_2_name, custom_attribute_2_value,
                          custom_attribute_3_name, custom_attribute_3_value,
                          custom_attribute_4_name, custom_attribute_4_value,
                          custom_attribute_5_name, custom_attribute_5_value) {

    await axios.post(process.env.REACT_APP_SERVER_URL, {
        query: print(NEW_PHYSICAL_GOOD_MUTATION),
        variables: {
            title: title,
            description: description,
            quantity: parseInt(quantity, 10),
            listing_price: parseFloat(listing_price),
            general_category: general_category,
            main_image_secure: main_image_cloudinary_secure_url[0],
            other_images_secure: other_images_cloudinary_secure_url,
            currency: currency,
            seller_token: sessionStorage.getItem("jwtToken_business"),
            height_mm: parseFloat(height_mm),
            length_mm: parseFloat(length_mm),
            width_mm: parseFloat(width_mm),
            weight_g: parseFloat(weight_g),
            custom_attribute_1_name: custom_attribute_1_name,
            custom_attribute_2_name: custom_attribute_2_name,
            custom_attribute_3_name: custom_attribute_3_name,
            custom_attribute_4_name: custom_attribute_4_name,
            custom_attribute_5_name: custom_attribute_5_name,
            custom_attribute_1_value: custom_attribute_1_value,
            custom_attribute_2_value: custom_attribute_2_value,
            custom_attribute_3_value: custom_attribute_3_value,
            custom_attribute_4_value: custom_attribute_4_value,
            custom_attribute_5_value: custom_attribute_5_value,
        }
    }).then(() => {
            message.success("You successfully added a physical good");
            window.location.reload();
            return true;
        }
    ).catch(error => {
        if (error.response) {
            if (error.response.data) {
                if (error.response.data.errors[0]) {
                    const errorMessage = error.response.data.errors[0].message;
                    if (errorMessage !== null) {
                        message.error(errorMessage);
                    }
                }
            }
        }
        message.error("There was an error adding your physical good. Please try again.");
        return false;
    });
}


export default class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: undefined,
            description: undefined,
            listing_price: undefined,
            quantity: undefined,
            currency: undefined,
            general_category: undefined,
            height_mm: undefined,
            length_mm: undefined,
            width_mm: undefined,
            weight_g: undefined,
            main_image_file: undefined, other_images_files: undefined,
            custom_attribute_1_name: undefined, custom_attribute_1_value: undefined,
            custom_attribute_2_name: undefined, custom_attribute_2_value: undefined,
            custom_attribute_3_name: undefined, custom_attribute_3_value: undefined,
            custom_attribute_4_name: undefined, custom_attribute_4_value: undefined,
            custom_attribute_5_name: undefined, custom_attribute_5_value: undefined,
            formErrors: {
                quantity: '',
                title: '',
                description: '',
                listing_price: '',
                currency: '',
                general_category: '',
                main_image_file: '',
                other_images_files: '',
                height_mm: '',
                length_mm: '',
                width_mm: '',
                weight_g: '',
                custom_attribute_1: '',
                custom_attribute_2: '',
                custom_attribute_3: '',
                custom_attribute_4: '',
                custom_attribute_5: '',
            },
            submitting_new_good: false,
            successfully_added_new_physical_good: false,
            canSubmit: false,
            refresh_this_page: false
        };
        this.NewGoodSubmit = this.NewGoodSubmit.bind(this);
        this.NewProductDetailsEntered = this.NewProductDetailsEntered.bind(this);
        this.renderFeesAndPayment = this.renderFeesAndPayment.bind(this);
    };

    NewGoodSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            submitting_new_good: true
        });
        if (this.state.successfully_added_new_physical_good === false && this.state.submitting_new_good === true) {
            message.loading('Adding a new Physical good ...', 5000);
        }

        //TODO: submit button logic
        const {
            title,
            description,
            listing_price,
            quantity,
            currency,
            general_category,
            height_mm, length_mm, width_mm, weight_g,
            main_image_file, other_images_files,
            custom_attribute_1_name, custom_attribute_1_value,
            custom_attribute_2_name, custom_attribute_2_value,
            custom_attribute_3_name, custom_attribute_3_value,
            custom_attribute_4_name, custom_attribute_4_value,
            custom_attribute_5_name, custom_attribute_5_value
        } = this.state;

        let main_image_cloudinary_submit = await UploadImages(main_image_file);
        let other_images_cloudinary_submit = await UploadImages(other_images_files);

        let main_image_cloudinary_secure_url = main_image_cloudinary_submit.secure_url;
        let other_images_cloudinary_secure_url = other_images_cloudinary_submit.secure_url;


        if (main_image_cloudinary_secure_url) {
            let adding_good_success = await AddNewGood(title,
                description,
                listing_price,
                quantity,
                currency,
                general_category,
                main_image_cloudinary_secure_url, other_images_cloudinary_secure_url,
                height_mm, length_mm, width_mm, weight_g,
                custom_attribute_1_name, custom_attribute_1_value,
                custom_attribute_2_name, custom_attribute_2_value,
                custom_attribute_3_name, custom_attribute_3_value,
                custom_attribute_4_name, custom_attribute_4_value,
                custom_attribute_5_name, custom_attribute_5_value);
        }

        this.setState({
            submitting_new_good: false
        });
    };
    newgoodButton = () => {
        //TODO: make button text better
        const button_text = (this.state.submitting_new_good === true) ? "" : "Add a good";
        const button_is_disabled = ((this.state.successfully_added_new_physical_good === true) && (!this.state.canSubmit && !this.state.successfully_added_new_physical_good));
        const on_click_action = ((!this.state.submitting_new_good) && (this.state.successfully_added_new_physical_good !== true)) ? this.NewGoodSubmit : null;


        if (this.state.successfully_added_new_physical_good === false) {
            return (
                <button
                    type="button"
                    disabled={button_is_disabled}
                    loading={this.state.submitting_new_good}
                    onClick={on_click_action}
                    className="btn btn-outline-primary btn-block">
                    <Spin indicator={antIcon} spinning={this.state.submitting_new_good}/>
                    {button_text}
                </button>
            );
        }

        //TODO: disabled should be dyanmic. Fix form validation
        return (
            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>
        );
    };

    renderFeesAndPayment(mode) {
        if (this.state.title && this.state.listing_price && this.state.quantity && this.state.currency) {
            let local_quantity = 0;
            const {currency, listing_price, quantity, general_category} = this.state;
            if (mode === "single") {
                local_quantity = 1
            } else {
                local_quantity = quantity;
            }
            //Calculations
            const pre_tax_revenue = Math.round((listing_price * local_quantity) * 100) / 100;
            const revenue = Math.round((pre_tax_revenue * (1 + category_and_tax[general_category])) * 100) / 100;
            const stripe_payment_fees = Math.round((revenue * 0.014 + 0.25) * 100) / 100;
            const rocketnow_fee = Math.round((pre_tax_revenue * 0.1) * 100) / 100;
            const business_VAT_tax = Math.round((revenue - pre_tax_revenue) * 100) / 100;
            const net_revenue = Math.round((revenue - stripe_payment_fees - rocketnow_fee - business_VAT_tax) * 100) / 100;
            const currency_transformed = currency_symbol_converter(currency);


            return (
                <div>
                    <div className="row">
                        <div className="col-md-12 col-xl-3 mb-4">
                            <div className="card shadow border-left-success py-2">
                                <div className="card-body">
                                    <div className="row align-items-center no-gutters">
                                        <div className="col mr-2">
                                            <div
                                                className="text-uppercase text-success font-weight-bold text-xs mb-1">
                                                <span>Revenue</span></div>
                                            <div className="text-dark font-weight-bold h5 mb-0">
                                                <span>{revenue}{currency_transformed} </span></div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-xl-4 mb-4">
                            <div className="card shadow border-left-danger py-2">
                                <div className="card-body">
                                    <div className="row align-items-center no-gutters">
                                        <div className="col mr-2">
                                            <div
                                                className="text-uppercase text-danger font-weight-bold text-xs mb-1">
                                                <span>RocketNow fee</span></div>
                                            <div className="text-dark font-weight-bold h5 mb-0">
                                                <span>{rocketnow_fee}{currency_transformed} </span></div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 col-xl-5 mb-4">
                            <div className="card shadow border-left-danger py-2">
                                <div className="card-body">
                                    <div className="row align-items-center no-gutters">
                                        <div className="col mr-2">
                                            <div
                                                className="text-uppercase text-danger font-weight-bold text-xs mb-1">
                                                <span>Payment processing</span></div>
                                            <div className="text-dark font-weight-bold h5 mb-0">
                                                <span>{stripe_payment_fees}{currency_transformed} </span></div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-xl-3 mb-4">
                            <div className="card shadow border-left-danger py-2">
                                <div className="card-body">
                                    <div className="row align-items-center no-gutters">
                                        <div className="col mr-2">
                                            <div
                                                className="text-uppercase text-danger font-weight-bold text-xs mb-1">
                                                <span>VAT</span></div>
                                            <div className="text-dark font-weight-bold h5 mb-0">
                                                <span>{business_VAT_tax}{currency_transformed} </span></div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-xl-4 mb-4">
                            <div className="card shadow border-left-success py-2">
                                <div className="card-body">
                                    <div className="row align-items-center no-gutters">
                                        <div className="col mr-2">
                                            <div
                                                className="text-uppercase text-success font-weight-bold text-xs mb-1">
                                                <span>Net revenue</span></div>
                                            <div className="text-dark font-weight-bold h5 mb-0">
                                                <span>{net_revenue}{currency_transformed} </span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    {this.newgoodButton()}
                </div>
            );

        } else {
            return (
                <div>
                    <h4>Complete the necessary product details first.</h4>
                </div>
            );
        }
    }


    NewProductDetailsEntered(title, description,
                             listing_price, quantity, currency,
                             general_category,
                             height_mm, length_mm, width_mm, weight_g,
                             main_image_file, other_images_files,
                             custom_attribute_1_name, custom_attribute_1_value,
                             custom_attribute_2_name, custom_attribute_2_value,
                             custom_attribute_3_name, custom_attribute_3_value,
                             custom_attribute_4_name, custom_attribute_4_value,
                             custom_attribute_5_name, custom_attribute_5_value,
    ) {
        this.setState({
            title: title,
            description: description,
            listing_price: Math.round(100 * listing_price) / 100,
            quantity: quantity,
            currency: currency,
            general_category: general_category,
            height_mm: Math.round(100 * height_mm) / 100,
            length_mm: Math.round(100 * length_mm) / 100,
            width_mm: Math.round(100 * width_mm) / 100,
            weight_g: Math.round(100 * weight_g) / 100,
            main_image_file: main_image_file,
            other_images_files: other_images_files,
            custom_attribute_1_name: custom_attribute_1_name,
            custom_attribute_2_name: custom_attribute_2_name,
            custom_attribute_3_name: custom_attribute_3_name,
            custom_attribute_4_name: custom_attribute_4_name,
            custom_attribute_5_name: custom_attribute_5_name,
            custom_attribute_1_value: custom_attribute_1_value,
            custom_attribute_2_value: custom_attribute_2_value,
            custom_attribute_3_value: custom_attribute_3_value,
            custom_attribute_4_value: custom_attribute_4_value,
            custom_attribute_5_value: custom_attribute_5_value,
        });
    };

    render() {
        const cannonial_url = process.env.REACT_APP_PUBLIC_URL + "/business/new/product";
        return (
            <div id="page-top">
                <Helmet>
                    <title>New Product</title>
                    <meta property="og:title" content="New Product"/>
                    <link rel="canonial" href={cannonial_url}/>
                    <meta property="og:description"
                          content="Add new product to your RocketNow store"/>
                    <meta name="description" content="Add new product to your RocketNow store"/>
                </Helmet>
                <link rel="stylesheet"
                      href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"/>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css"/>
                <div id="businessWrapper">
                    <Menu/>
                    <div className="d-flex flex-column" id="content-wrapper">
                        <div id="content">
                            <BusinessNavbar/>
                            <div className="container-fluid">
                                <div className="d-sm-flex justify-content-between align-items-center mb-4">
                                    <h3 className="text-dark mb-0">New Product</h3>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-xl-6 mb-4">
                                        <div className="card shadow mb-4">
                                            <div className="card-header py-3">
                                                <h6 className="text-primary font-weight-bold m-0">New Product
                                                    details</h6>
                                            </div>
                                            <div className="card-body">
                                                <PhysicalGoodForm
                                                    NewProductDetailsEntered={this.NewProductDetailsEntered}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-xl-6 mb-4">
                                        <div className="card shadow mb-4">
                                            <div className="card-header py-3">
                                                <h6 className="text-primary font-weight-bold m-0">Summary</h6>
                                            </div>
                                            <div className="card-body">
                                                <Tabs defaultActiveKey="1">
                                                    <TabPane tab="Single product" key="1">
                                                        {this.renderFeesAndPayment("single")}
                                                    </TabPane>
                                                    <TabPane tab="Total" key="2">
                                                        {this.renderFeesAndPayment("multiple")}
                                                    </TabPane>
                                                </Tabs>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <BusinessFooter/>
                    </div>
                </div>
            </div>
        );
    }
};