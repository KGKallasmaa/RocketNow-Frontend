import React from "react";
import App from './App.jsx';
import * as serviceWorker from './serviceWorker';
import { render } from "react-dom";


const rootElement = document.getElementById("root");
render(<App />, rootElement);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
