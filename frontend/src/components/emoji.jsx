import omniva_logo from "../pages/checkout/parcelDeliveryLocation_img/omniva-logo.png";
import itella_logo from "../pages/checkout/parcelDeliveryLocation_img/itella-logo.svg";
import dbd_logo from "../pages/checkout/parcelDeliveryLocation_img/dpd-logo.png";
import React from "react";

export const getEmoji = (name) => {
    switch (name) {
        case "Estonia":
            return "🇪🇪";
        case "Latvia":
            return "🇱🇻";
        case "Lithuania":
            return "🇱🇹";
        case "Omniva":
            return <span role="img" aria-label="Omniva"><img src={omniva_logo} width="28" height="28"
                                                             alt="Omniva"/> </span>;
        case "Itella":
            return <span role="img" aria-label="Itella"><img src={itella_logo} width="28" height="28"
                                                             alt="Itella"/> </span>;
        case "DPD":
            return <span role="img" aria-label="DPD"><img src={dbd_logo} width="28" height="28"
                                                          alt="DPD"/> </span>;
    }
};