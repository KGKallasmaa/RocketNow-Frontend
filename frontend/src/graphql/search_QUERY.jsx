import gql from "graphql-tag";

export const SEARCH_QUERY = gql`
    query Search($query: String!,$page_nr:Int!) {
        search(searchInput:{query: $query,page_nr:$page_nr}) {
            _id
            title
            nr
            current_price
            general_category {
                name
                tax
            }
            listing_timestamp
            quantity
            currency
            main_image_cloudinary_secure_url
            seller {
                businessname
                nr
            }
            custom_attribute_names
            custom_attribute_values
        }
    }
`;