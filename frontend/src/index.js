import React from 'react';
import * as serviceWorker from './serviceWorker';
import ReactDOM from 'react-dom';
import App from './App';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {InMemoryCache} from 'apollo-cache-inmemory';


const cache = new InMemoryCache();


const client = new ApolloClient({
    uri: process.env.REACT_APP_SERVER_URL,
    cache
})
const app = (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
);
ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();