import React from 'react';
import SearchBox from "./searchBox.jsx";
import {isRegularUserLoggedIn} from "./authentication";

const style = {
    fontSize: "23px",
    marginBottom: "5px"
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const Navbar = React.memo((props) => {
        const userIsLoggedIn = isRegularUserLoggedIn();
        if (!userIsLoggedIn) {
            const currentTemporaryUserID = sessionStorage.getItem("temporary_user_id");
            if (!currentTemporaryUserID) {
                const temporaryUserID = uuidv4();
                sessionStorage.setItem("temporary_user_id", temporaryUserID.toString());
                console.log(sessionStorage.getItem("temporary_user_id"))
            }
        }
        const login_or_logout_button_text = (!userIsLoggedIn) ? "Login" : "Logout";
        const login_or_logout_button_url = (!userIsLoggedIn) ? ("/login") : ("/logout");
        return (
            <nav className="navbar navbar-dark navbar-expand-lg fixed-top bg-dark navbar-custom">
                <div className="container">
                    <a className="navbar-brand" href="/" style={style} aria-label={"Homepage"}>
                        RocketNow
                    </a>
                    <form className="form-inline mr-auto" target="_self">
                        <SearchBox query={props.query} type={props.type}/>
                    </form>
                    <button data-toggle="collapse" className="navbar-toggler" data-target="#navbarResponsive"
                            aria-label={"View navigation options"}>
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="nav navbar-nav ml-auto">
                            <li className="nav-item" role="presentation">
                                <a className="nav-link" href="/me" aria-label={"Your account page"}>My account</a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a className="nav-link" href="/cart">
                                    Cart
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a className="nav-link" aria-label={login_or_logout_button_text}
                                   href={login_or_logout_button_url}>
                                    {login_or_logout_button_text}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
);