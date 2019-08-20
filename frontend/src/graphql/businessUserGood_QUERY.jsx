import gql from "graphql-tag";

export const businessUserGoods_QUERY = gql`
    query businessUserGoods($nr:Int!,$businessname:String!) {
        businessUserGoods(nr:$nr,businessname:$businessname) {
            _id
            nr
            title
            main_image_cloudinary_secure_url
        }
    }
`;