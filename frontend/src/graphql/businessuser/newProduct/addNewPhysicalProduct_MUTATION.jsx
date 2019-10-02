import gql from "graphql-tag";
export const NEW_PHYSICAL_GOOD_MUTATION = gql`
    mutation addPhysicalGood($title:String!,$description:String!,$quantity:Int!,
        $listing_price:Float!,
        $general_category:String!,
        $main_image_secure: String!, $other_images_secure: [String!],
        $currency:String!,$seller_token:String!,
        $height_mm: Float!, $length_mm: Float!, $width_mm: Float!, $weight_g: Float!,
        $custom_attribute_1_name: String, $custom_attribute_2_name: String, $custom_attribute_3_name: String, $custom_attribute_4_name: String, $custom_attribute_5_name: String,
        $custom_attribute_1_value: String, $custom_attribute_2_value: String, $custom_attribute_3_value: String, $custom_attribute_4_value: String, $custom_attribute_5_value: String) {
        addPhysicalGood(goodInput:{
            title:$title,
            description:$description,
            quantity:$quantity,
            listing_price:$listing_price,
            general_category_name:$general_category,
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
`;
