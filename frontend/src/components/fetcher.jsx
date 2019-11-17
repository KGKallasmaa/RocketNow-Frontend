import axios from 'axios';
import {print} from "graphql";
import {message} from "antd";
import 'antd/es/message/style/css';


export const fetchData = async (variables, query) => {
    return await axios.post(process.env.REACT_APP_SERVER_URL, {
        query: print(query),
        variables: variables
    }).then(resData => {
            return resData.data.data;
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
        return null;
    });
};