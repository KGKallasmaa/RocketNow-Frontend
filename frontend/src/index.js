import React from 'react';
import * as serviceWorker from './serviceWorker';
import App from './App.jsx';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {InMemoryCache} from 'apollo-cache-inmemory';
import ReactDOM from 'react-dom';

const cache = new InMemoryCache();


const client = new ApolloClient({
    uri: process.env.REACT_APP_SERVER_URL,
    cache
});
const app = (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
);

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();