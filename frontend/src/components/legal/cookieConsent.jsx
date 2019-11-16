import React from "react";
import CookieConsent from "react-cookie-consent";

export default React.memo(() => {
        return (
            <CookieConsent
                location="bottom"
                buttonText="Got it!"
                cookieName="rocketNowUserConsentCookie"
                style={{background: "#2B373B"}}
                buttonStyle={{color: "#4e503b", fontSize: "13px"}}
                expires={150}
            >
                By using RocketNow’s services you agree to our <a href={"/privacy"}>Cookies Policy</a>
            </CookieConsent>
        );
    }
);