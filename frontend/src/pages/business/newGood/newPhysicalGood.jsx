import React from 'react';
import {Form, Select, Tooltip} from 'antd';
import {DropzoneArea} from 'material-ui-dropzone';

const {Option} = Select;



//Helper funcions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//TODO: make it more accurate. Add business logic; add monthly fund transfer fee


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
        this.updateParent = this.updateParent.bind(this);
        this.selectCurrency = this.selectCurrency.bind(this);
        this.selectGeneralCategory = this.selectGeneralCategory.bind(this);
        this.SetMainImage = this.SetMainImage.bind(this);
        this.SetOtherImages = this.SetOtherImages.bind(this);
    };


    //TODO: fix button styles



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
        this.updateParent();
    }

    selectGeneralCategory(value) {
        this.setState({general_category: value});
        this.updateParent();
    }
    updateParent(){
        const {title, description,
            listing_price, quantity, currency,
            general_category,
            height_mm,length_mm, width_mm, weight_g,
            main_image_file,other_images_files,
            custom_attribute_1_name,custom_attribute_1_value,
            custom_attribute_2_name,custom_attribute_2_value,
            custom_attribute_3_name,custom_attribute_3_value,
            custom_attribute_4_name, custom_attribute_4_value,
            custom_attribute_5_name,custom_attribute_5_value} = this.state;

        this.props.NewProductDetailsEntered(
            title, description,
            listing_price, quantity, currency,
            general_category,
            height_mm,length_mm, width_mm, weight_g,
            main_image_file,other_images_files,
            custom_attribute_1_name,custom_attribute_1_value,
            custom_attribute_2_name,custom_attribute_2_value,
            custom_attribute_3_name,custom_attribute_3_value,
            custom_attribute_4_name, custom_attribute_4_value,
            custom_attribute_5_name,custom_attribute_5_value
        );
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
            }, () => this.canSubmit());



            if (this.state.formValidity.title && this.state.formValidity.listing_price && this.state.formValidity.quantity){
                this.updateParent();
            }
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
        this.updateParent();
    }

    SetOtherImages(files) {
        this.setState({
            other_images_files: files
        });
        this.updateParent();
    }



    render() {
        //TODO: better names for {product details, shipping details,finances}
        const available_general_categories = this.getGenralCategories();
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
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
                                        type="number"
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
                            <Form.Item label="Shipping properties:&nbsp;&nbsp;&nbsp;&nbsp;">
                                <div className="form-check form-check-inline">
                                    <input
                                        className={`form-control ${this.errorClass(this.state.formErrors.height_mm)}`}
                                        id="height_mm"
                                        name="height_mm"
                                        min={1}
                                        max={21474836}
                                        type="number"
                                        placeholder="height mm"
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
                </div>
            </div>
        )
    }
}

export default Form.create()(PhysicalGoodForm);
//TODO: test { adding an item with at title that already exsits => it currently failes on the client side}