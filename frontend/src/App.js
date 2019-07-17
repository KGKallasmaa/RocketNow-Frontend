import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import BaseRouter from './routes';
import 'antd/dist/antd.css';


export default class App extends Component {
    state = {
        token: null,
        userId: null
    };
    login = (token, userId, tokenExpiration) => {
        this.setState({token: token, userId: userId});
        // setter
        sessionStorage.setItem('token', token);
    };
    logout = () => {
        this.setState({token: null, userId: null});
        sessionStorage.removeItem('token');
    };

    render() {
        return (
            <div>
                <Router>
                    <BaseRouter token={this.state.token}/>
                </Router>
            </div>
        );
    }
}