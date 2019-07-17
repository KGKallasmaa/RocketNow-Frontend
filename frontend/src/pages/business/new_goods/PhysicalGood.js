import React from 'react';
import {Form, Icon, message, Select, Spin, Tooltip} from 'antd';
import {DropzoneArea} from 'material-ui-dropzone';
import {Button} from "react-bootstrap";
import axios from 'axios';

const {Option} = Select;


const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

//Helper funcions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//TODO: make it more accurate. Add business logic; add monthly fund transfer fee

function CalculateNoNoLineFee(quantity, listing_price) {
    const no_no_line_fee = 0.1;
    const no_no_line_fee_amount = no_no_line_fee * (quantity * listing_price);
    return Math.round(no_no_line_fee_amount * 100) / 100;
}

function CalculateStripeFees(quantity, listing_price, currency) {
    const stripe_base_card_charge_fee_eur = 0.25;
    const stripe_variable_card_charge_fee = (currency === "EUR") ? 0.014 : 0.029;
    const stripe_card_charge_fee_eur = (quantity * stripe_base_card_charge_fee_eur) + (listing_price * stripe_variable_card_charge_fee * quantity);
    return Math.round(stripe_card_charge_fee_eur * 100) / 100;
}

async function UploadImages(files) {
    let return_dictionary = {};

    let data = new FormData();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        data.append("GoodImageFile", file);
    }

    const response = await axios.post(process.env.REACT_APP_IMAGE_UPLOAD_URL, data, config);    const config = {
        headers: {'content-type': 'multipart/form-data'}
    };
    let public_id_array = Array();
    let secure_url_array = Array();
    for (let index = 0; index < response.data.length; index++) {
        const original_secure_url_element = response.data[index].secure_url;
        let original_public_id_element = response.data[index].public_id;
        //Json can't pars symbol "/"
        public_id_array.push((original_public_id_element.split("/").pop()).toString());
        secure_url_array.push(original_secure_url_element);
    }
    return_dictionary["public_id"] = public_id_array;
    return_dictionary["secure_url"] = secure_url_array;

    return return_dictionary
}

async function AddNewGood(title, description, listing_price, quantity, currency, general_category, timestamp, main_image_cloudinary_public_id, other_images_cloudinary_public_id, main_image_cloudinary_secure_url, other_images_cloudinary_secure_url, height_mm, length_mm, width_mm, weight_g, custom_attribute_1_name, custom_attribute_2_name, custom_attribute_3_name, custom_attribute_4_name, custom_attribute_5_name, custom_attribute_1_value, custom_attribute_2_value, custom_attribute_3_value, custom_attribute_4_value, custom_attribute_5_value) {

    const response = await axios.post(process.env.REACT_APP_SERVER_URL, {
        query: `
            mutation addPhysicalGood($title:String!,$description:String!,$quantity:Int!,
                $current_price:Float!,$listing_price:Float!,
                $timestamp:String!,$general_category:String!,
                $main_image: String!, $other_images: [String!], $main_image_secure: String!, $other_images_secure: [String!],
                $currency:String!,$seller_token:String!,
                $height_mm: Float!, $length_mm: Float!, $width_mm: Float!, $weight_g: Float!,
                $custom_attribute_1_name: String, $custom_attribute_2_name: String, $custom_attribute_3_name: String, $custom_attribute_4_name: String, $custom_attribute_5_name: String,
                $custom_attribute_1_value: String, $custom_attribute_2_value: String, $custom_attribute_3_value: String, $custom_attribute_4_value: String, $custom_attribute_5_value: String) {
                addPhysicalGood(goodInput:{
                    title:$title,
                    description:$description,
                    quantity:$quantity,
                    current_price:$current_price,
                    listing_price:$listing_price,
                    listing_timestamp:$timestamp,
                    general_category_name:$general_category,
                    main_image_cloudinary_public_id:$main_image,
                    other_images_cloudinary_public_id:$other_images,
                    main_image_cloudinary_secure_url:$main_image_secure,
                    other_images_cloudinary_secure_url:$other_images_secure,
                    currency:$currency,
                    seller_jwt_token:$seller_token,
                    height_mm:$height_mm,
                    length_mm:$length_mm,
                    width_mm:$width_mm,
                    weight_g:$weight_g,
                    custom_attribute_1_name:$custom_attribute_1_name,
                    custom_attribute_2_name:$custom_attribute_2_name,
                    custom_attribute_3_name:$custom_attribute_3_name,
                    custom_attribute_4_name:$custom_attribute_4_name,
                    custom_attribute_5_name:$custom_attribute_5_name,
                    custom_attribute_1_value:$custom_attribute_1_value,
                    custom_attribute_2_value:$custom_attribute_2_value,
                    custom_attribute_3_value:$custom_attribute_3_value,
                    custom_attribute_4_value:$custom_attribute_4_value,
                    custom_attribute_5_value:$custom_attribute_5_value})
                {
                  _id
                }
    }
  `,
        variables: {
            title: title,
            description: description,
            quantity: parseInt(quantity, 10),
            current_price: parseFloat(listing_price),
            listing_price: parseFloat(listing_price),
            timestamp: timestamp.toString(),
            general_category: general_category,
            main_image: main_image_cloudinary_public_id[0],
            other_images: other_images_cloudinary_public_id,
            main_image_secure: main_image_cloudinary_secure_url[0],
            other_images_secure: other_images_cloudinary_secure_url,
            currency: currency,
            seller_token: sessionStorage.getItem("business_jwtToken"),
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
    });
    return (response.status === 200 || response.status !== 201);
}

class PhysicalGoodForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            listing_price: '',
            quantity: 1,
            currency: '',
            general_category: '',
            height_mm: '',
            length_mm: '',
            width_mm: '',
            weight_g: '',
            custom_attribute_1_name: '',
            custom_attribute_2_name: '',
            custom_attribute_3_name: '',
            custom_attribute_4_name: '',
            custom_attribute_5_name: '',
            custom_attribute_1_value: '',
            custom_attribute_2_value: '',
            custom_attribute_3_value: '',
            custom_attribute_4_value: '',
            custom_attribute_5_value: '',
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
            formValidity: {
                quantity: true,
                currency: false,
                title: false,
                description: false,
                listing_price: false,
                general_category: false,
                main_image_file: false,
                other_images_files: false,
                height_mm: false,
                length_mm: false,
                width_mm: false,
                weight_g: false,
                custom_attribute_1: true,
                custom_attribute_2: true,
                custom_attribute_3: true,
                custom_attribute_4: true,
                custom_attribute_5: true,
            },
            submitting_new_good: false,
            successfully_added_new_physical_good: false,
            canSubmit: false,
            refresh_this_page: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.selectCurrency = this.selectCurrency.bind(this);
        this.selectGeneralCategory = this.selectGeneralCategory.bind(this);
        this.NewGoodSubmit = this.NewGoodSubmit.bind(this);
        this.SetMainImage = this.SetMainImage.bind(this);
        this.SetOtherImages = this.SetOtherImages.bind(this);
    };


    //TODO: fix button styles

    NewGoodSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            submitting_new_good: true
        });
        if (this.state.successfully_added_new_physical_good === false && this.state.submitting_new_good === true) {
            message.loading('Adding a new Physical good ...', 5000);
        }

        //TODO: submit button logic
        const {title, description, listing_price, quantity, currency, general_category, main_image_file, other_images_files, height_mm, length_mm, width_mm, weight_g} = this.state;
        const current_timestamp = new Date().getTime();

        let main_image_cloudinary_submit = await UploadImages(main_image_file);
        let other_images_cloudinary_submit = await UploadImages(other_images_files);

        const main_image_cloudinary_public_id = main_image_cloudinary_submit.public_id;
        const main_image_cloudinary_secure_url = main_image_cloudinary_submit.secure_url;
        const other_images_cloudinary_public_id = other_images_cloudinary_submit.public_id;
        const other_images_cloudinary_secure_url = other_images_cloudinary_submit.secure_url;


        if (main_image_cloudinary_public_id && main_image_cloudinary_secure_url) {
            let adding_good_success = await AddNewGood(title, description, listing_price, quantity, currency, general_category, current_timestamp, main_image_cloudinary_public_id, other_images_cloudinary_public_id, main_image_cloudinary_secure_url, other_images_cloudinary_secure_url, height_mm, length_mm, width_mm, weight_g);

            if (adding_good_success === true) {
                this.setState({
                    successfully_added_new_physical_good: true,
                    submitting_new_good: false
                });
                message.success("You successfully added a physical good");
                window.location.reload();
            } else {
                message.error("There was an error adding your physical good. Please try again.");
            }
        } else {
            message.error("Images were not correctly uploaded to the server.");
        }

        this.setState({
            submitting_new_good: false
        });
    };
    newgoodButton = () => {
        //TODO: make button text better
        const button_text = (this.state.submitting_new_good === true) ? "" : "Add a physical good";
        const button_is_disabled = ((this.state.successfully_added_new_physical_good === true) && (!this.state.canSubmit && !this.state.successfully_added_new_physical_good));
        const on_click_action = ((!this.state.submitting_new_good) && (this.state.successfully_added_new_physical_good !== true)) ? this.NewGoodSubmit : null;


        if (this.state.successfully_added_new_physical_good === false) {
            return (
                <Button
                    bsStyle="success"
                    disabled={button_is_disabled}
                    loading={this.state.submitting_new_good}
                    onClick={on_click_action}
                >
                    <Spin indicator={antIcon} spinning={this.state.submitting_new_good}/>
                    {button_text}
                </Button>
            );
        }
        //TODO: disabled should be dyanmic. Fix form validation
        return (
            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>
        );
    };


    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        }, function () {
            this.validateField(name, value)
        })
    }

    selectCurrency(value) {
        this.setState({
            currency: value
        });
    }

    selectGeneralCategory(value) {
        this.setState({general_category: value});
    }

    validateField(name, value) {
        const fieldValidationErrors = this.state.formErrors;
        const validity = this.state.formValidity;


        const isCustom_1_name = name === "custom_attribute_1_name";
        const isCustom_2_name = name === "custom_attribute_2_name";
        const isCustom_3_name = name === "custom_attribute_3_name";
        const isCustom_4_name = name === "custom_attribute_4_name";
        const isCustom_5_name = name === "custom_attribute_5_name";

        const isCustom_1_value = name === "custom_attribute_1_value";
        const isCustom_2_value = name === "custom_attribute_2_value";
        const isCustom_3_value = name === "custom_attribute_3_value";
        const isCustom_4_value = name === "custom_attribute_4_value";
        const isCustom_5_value = name === "custom_attribute_5_value";


        if (!isCustom_1_name | !isCustom_2_name | !isCustom_3_name | !isCustom_4_name | !isCustom_5_name | !isCustom_1_value | !isCustom_2_value | !isCustom_3_value | !isCustom_4_value | !isCustom_5_value) {
            validity[name] = value.length > 0;
            //It test whether the fields are empty
            fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} is required and cannot be empty.`);
            if (validity[name]) {

                switch (name) {
                    case ("title"):
                        //TODO: make it better: https://sellercentral.amazon.com/gp/help/external/G201051300?language=en_US

                        //The first letter should be a capital letter
                        validity[name] = /[A-Z]/.test(value[0]);

                        if (validity === true) {
                            //The tile should be between 1 and 50 characters
                            validity[name] = value.length >= 1 && value.length <= 50;
                            fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} should between 1 and 50 characters.`);
                        } else {
                            fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} should start with a capital letter.`);
                        }
                        break;
                    case ("description"):
                        //The first letter should be a capital letter
                        validity[name] = /[A-Z]/.test(value[0]);

                        if (validity === true) {
                            //The tile should be between 1 and 2000 characters
                            validity[name] = value.length >= 1 && value.length <= 2000;
                            fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} should between 1 and 2000 characters`);
                        } else {
                            fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `${name} should start with a capital letter.`);
                        }
                        break;
                    case ("listing_price"):
                        validity[name] = value > 0;
                        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Listing price should greater than 0`);
                        break;
                    case ("quantity"):
                        validity[name] = value >= 1;
                        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Quantity should greater or equal to 1`);
                        break;
                    case ("currency"):
                        validity[name] = this.state.currency.length === 1;
                        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Please select a currency for your product`);
                        break;
                    case ("general_category"):
                        validity[name] = this.state.currency.length === 1;
                        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Please select a general category for your product`);
                        break;
                    case ("main_image_file"):
                        validity[name] = this.state.main_image_file.length === 1;
                        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Every product needs to have one image`);
                        break;
                    case ("other_images_files"):
                        validity[name] = this.state.other_images_files.length >= 1;
                        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Every product needs to have one image`);
                        break;
                    case ("height_mm"):
                        validity[name] = value >= 1;
                        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Height must be greater than 1.`);
                        break;
                    case ("length_mm"):
                        validity[name] = value >= 1;
                        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Length must be positive.`);
                        break;
                    case ("width_mm"):
                        validity[name] = value >= 1;
                        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Width must be positive.`);
                        break;
                    case ("weight_g"):
                        validity[name] = value >= 1;
                        fieldValidationErrors[name] = capitalizeFirstLetter(validity[name] ? '' : `Weight must be positive.`);
                        break;
                    default:
                        console.log("Error validating the form: Value %s is not a valid name", name);
                        break;
                }
            }
            this.setState({
                formErrors: fieldValidationErrors,
                formValidity: validity,
            }, () => this.canSubmit())
        }
    }

    errorClass(error) {
        if (error) {
            return (error.length === 0 ? '' : 'is-invalid');
        }
        return ''

    }

    canSubmit() {
        this.setState({
            canSubmit: this.state.formValidity.listing_price && this.state.formValidity.other_images_files && this.state.formValidity.main_image_file && this.state.formValidity.general_category && this.state.formValidity.description && this.state.formValidity.currency && this.state.formValidity.title
        })
    }

    getGenralCategories() {
        //Make a query to the database

        let options_array = [];
        const requestBody = {
            query: `
               {
                allGeneralCategories{
                  name
                }
              }
            `
        };
        fetch(process.env.REACT_APP_SERVER_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const category_names_as_array = resData.data.allGeneralCategories;
                category_names_as_array.forEach(element => {
                    options_array.push(<Option value={element.name}>{element.name}</Option>);
                });
            })
            .catch(err => {
                console.log(err);
            });
        return (
            <Select
                showSearch
                placeholder="Select a general category"
                optionFilterProp="children"
                maxTagCount={5}
                onChange={this.selectGeneralCategory}
                value={this.state.general_category}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {options_array}
            </Select>
        );
    }

    SetMainImage(files) {
        this.setState({
            main_image_file: files
        });
    }

    SetOtherImages(files) {
        this.setState({
            other_images_files: files
        });
    }


    renderFeesAndPayment() {
        if (this.state.formValidity.title && this.state.formValidity.listing_price && this.state.formValidity.quantity) {
            const {currency, listing_price, quantity, title} = this.state;
            const revenue = Math.round((listing_price * quantity) * 100) / 100;

            const stripe_payment_fees = CalculateStripeFees(quantity, listing_price, currency);
            const no_no_line_fees = CalculateNoNoLineFee(quantity, listing_price);
            const net_revenue = Math.round((revenue - stripe_payment_fees - no_no_line_fees) * 100) / 100;
            return (
                <div>
                    <h4>Expected revenue from ({title}):<b>{revenue}{currency}</b></h4>
                    <h5>NoNoLine fees:<b>{no_no_line_fees}{currency}</b></h5>
                    <h5>Payment fees(Stripe):<b>{stripe_payment_fees}{currency}</b></h5>
                    <h4>Net revenue:<b>{net_revenue}{currency}</b></h4>
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

    render() {
        //TODO: better names for {product details, shipping details,finances}
        const available_general_categories = this.getGenralCategories();
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <Form className="login-form" layout="horizontal">
                            <Form.Item label="Title">
                                <input
                                    className={`form-control ${this.errorClass(this.state.formErrors.title)}`}
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Enter a title for your good"
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                />
                                <div className="invalid-feedback">{this.state.formErrors.title}</div>
                            </Form.Item>
                            <Form.Item label="Description">
                                <textarea
                                    className={`form-control ${this.errorClass(this.state.formErrors.description)}`}
                                    id="description"
                                    name="description"
                                    type="text"
                                    placeholder="Enter a description for your good"
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                />
                                <div className="invalid-feedback">{this.state.formErrors.description}</div>
                            </Form.Item>
                            <Form.Item label="Categories">
                                {available_general_categories}
                            </Form.Item>
                            <Form.Item label="Price:&nbsp;&nbsp;&nbsp;&nbsp;">
                                <div className="form-check form-check-inline">
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.listing_price)}`}
                                        id="listing_price"
                                        name="listing_price"
                                        min={0.01}
                                        max={21474836}
                                        type="text"
                                        placeholder="price"
                                        value={this.state.listing_price}
                                        onChange={this.handleChange}
                                    />
                                    <div className="invalid-feedback">{this.state.formErrors.listing_price}</div>
                                    <Select size="large" value={this.state.currency} onChange={this.selectCurrency}>
                                        <Option value="USD">$[USD]</Option>
                                        <Option value="EUR">€[EUR]</Option>
                                        <Option value="GBP">£ [GBP]</Option>
                                        <Option value="RUB">₽ [RUB]</Option>
                                    </Select>
                                </div>
                            </Form.Item>
                            <Form.Item label="Shipping properties:&nbsp;&nbsp;&nbsp;&nbsp;">
                                <div className="form-check form-check-inline">
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.height_mm)}`}
                                        id="height_mm"
                                        name="height_mm"
                                        min={1}
                                        max={21474836}
                                        type="number"
                                        placeholder="height mmm"
                                        value={this.state.height_mm}
                                        onChange={this.handleChange}
                                    />
                                    <p>&nbsp;&nbsp;&nbsp;</p>
                                    <div className="invalid-feedback">{this.state.formErrors.height_mm}</div>
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.length_mm)}`}
                                        id="length_mm"
                                        name="length_mm"
                                        min={1}
                                        max={21474836}
                                        type="number"
                                        placeholder="length mm"
                                        value={this.state.length_mm}
                                        onChange={this.handleChange}
                                    />
                                    <p>&nbsp;&nbsp;&nbsp;</p>
                                    <div className="invalid-feedback">{this.state.formErrors.length_mm}</div>
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.width_mm)}`}
                                        id="width_mm"
                                        name="width_mm"
                                        min={1}
                                        max={21474836}
                                        type="number"
                                        placeholder="width mm"
                                        value={this.state.width_mm}
                                        onChange={this.handleChange}
                                    />
                                    <p>&nbsp;&nbsp;&nbsp;</p>
                                    <div className="invalid-feedback">{this.state.formErrors.width_mm}</div>
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.weight_g)}`}
                                        id="weight_g"
                                        name="weight_g"
                                        min={1}
                                        max={21474836}
                                        type="number"
                                        placeholder="weight g"
                                        value={this.state.weight_g}
                                        onChange={this.handleChange}
                                    />
                                    <p>&nbsp;&nbsp;&nbsp;</p>
                                    <div className="invalid-feedback">{this.state.formErrors.weight_g}</div>
                                </div>
                            </Form.Item>
                            <Form.Item label="Quantity:&nbsp;&nbsp;&nbsp;&nbsp;">
                                <div className="form-check form-check-inline">
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.quantity)}`}
                                        id="quantity"
                                        name="quantity"
                                        min={1}
                                        max={21474836}
                                        type="number"
                                        placeholder="q"
                                        value={this.state.quantity}
                                        onChange={this.handleChange}
                                    />
                                    <div className="invalid-feedback">{this.state.formErrors.quantity}</div>
                                </div>
                            </Form.Item>
                            <Form.Item label="Main image">
                                <DropzoneArea
                                    filesLimit={1}
                                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                                    dropzoneText="Drag and drop your main image file here"
                                    onChange={this.SetMainImage}
                                />
                            </Form.Item>
                            <Form.Item label="Other images">
                                <DropzoneArea
                                    filesLimit={12}
                                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                                    dropzoneText="Drag and drop your other image files here"
                                    onChange={this.SetOtherImages}
                                />
                            </Form.Item>
                            <Tooltip title="Custom attribute can be left empty">
                                <Form.Item label="Custom attributes:&nbsp;&nbsp;&nbsp;&nbsp;">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className={`form-control ${this.errorClass(this.state.formErrors.custom_attribute_1_name)}`}
                                            id="custom_attribute_1_name"
                                            name="custom_attribute_1_name"
                                            type="string"
                                            placeholder="name"
                                            value={this.state.custom_attribute_1_name}
                                            onChange={this.handleChange}
                                        />
                                        <input
                                            className={`form-control ${this.errorClass(this.state.formErrors.custom_attribute_1_value)}`}
                                            id="custom_attribute_1_value"
                                            name="custom_attribute_1_value"
                                            type="string"
                                            placeholder="value"
                                            value={this.state.custom_attribute_1_value}
                                            onChange={this.handleChange}
                                        />
                                        <div
                                            className="invalid-feedback">{this.state.formErrors.custom_attribute_1}</div>
                                    </div>
                                    <br/>
                                    <br/>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className={`form-control ${this.errorClass(this.state.formErrors.custom_attribute_2_name)}`}
                                            id="custom_attribute_2_name"
                                            name="custom_attribute_2_name"
                                            type="string"
                                            placeholder="name"
                                            value={this.state.custom_attribute_2_name}
                                            onChange={this.handleChange}
                                        />
                                        <input
                                            className={`form-control ${this.errorClass(this.state.formErrors.custom_attribute_2_value)}`}
                                            id="custom_attribute_2_value"
                                            name="custom_attribute_2_value"
                                            type="string"
                                            placeholder="value"
                                            value={this.state.custom_attribute_2_value}
                                            onChange={this.handleChange}
                                        />
                                        <div
                                            className="invalid-feedback">{this.state.formErrors.custom_attribute_2}</div>
                                    </div>
                                    <br/>
                                    <br/>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className={`form-control ${this.errorClass(this.state.formErrors.custom_attribute_3_name)}`}
                                            id="custom_attribute_3_name"
                                            name="custom_attribute_3_name"
                                            type="string"
                                            placeholder="name"
                                            value={this.state.custom_attribute_3_name}
                                            onChange={this.handleChange}
                                        />
                                        <input
                                            className={`form-control ${this.errorClass(this.state.formErrors.custom_attribute_3_value)}`}
                                            id="custom_attribute_3_value"
                                            name="custom_attribute_3_value"
                                            type="string"
                                            placeholder="value"
                                            value={this.state.custom_attribute_3_value}
                                            onChange={this.handleChange}
                                        />
                                        <div
                                            className="invalid-feedback">{this.state.formErrors.custom_attribute_3}</div>
                                    </div>
                                    <br/>
                                    <br/>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className={`form-control ${this.errorClass(this.state.formErrors.custom_attribute_4_name)}`}
                                            id="custom_attribute_4_name"
                                            name="custom_attribute_4_name"
                                            type="string"
                                            placeholder="name"
                                            value={this.state.custom_attribute_4_name}
                                            onChange={this.handleChange}
                                        />
                                        <input
                                            className={`form-control ${this.errorClass(this.state.formErrors.custom_attribute_4_value)}`}
                                            id="custom_attribute_4_value"
                                            name="custom_attribute_4_value"
                                            type="string"
                                            placeholder="value"
                                            value={this.state.custom_attribute_4_value}
                                            onChange={this.handleChange}
                                        />
                                        <div
                                            className="invalid-feedback">{this.state.formErrors.custom_attribute_4}</div>
                                    </div>
                                    <br/>
                                    <br/>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className={`form-control ${this.errorClass(this.state.formErrors.custom_attribute_5_name)}`}
                                            id="custom_attribute_5_name"
                                            name="custom_attribute_5_name"
                                            type="string"
                                            placeholder="name"
                                            value={this.state.custom_attribute_5_name}
                                            onChange={this.handleChange}
                                        />
                                        <input
                                            className={`form-control ${this.errorClass(this.state.formErrors.custom_attribute_5_value)}`}
                                            id="custom_attribute_5_value"
                                            name="custom_attribute_5_value"
                                            type="string"
                                            placeholder="value"
                                            value={this.state.custom_attribute_5_value}
                                            onChange={this.handleChange}
                                        />
                                        <div
                                            className="invalid-feedback">{this.state.formErrors.custom_attribute_5}</div>
                                    </div>
                                    <br/>
                                    <br/>
                                </Form.Item>
                            </Tooltip>
                        </Form>
                    </div>
                    <div className="col-md-6">
                        <p>Fees and payments</p>
                        {this.renderFeesAndPayment()}
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(PhysicalGoodForm);
//TODO: test { adding an item with at title that already exsits => it currently failes on the client side}