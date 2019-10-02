export const isRegularUserLoggedIn = () => {
    if (sessionStorage.getItem("temporary_user_id")) {
        return false;
    }
    if (!sessionStorage.getItem("jwtToken") && !sessionStorage.getItem("jwtToken_expires")) {
        return false;
    }
    return !Number(sessionStorage.getItem("jwtToken_expires") < new Date().getTime());
};

export const isBusinessUserLoggedIn = () => {
    if (sessionStorage.getItem("temporary_user_id") || sessionStorage.getItem("jwtToken")) {
        return false;
    }

    if (!sessionStorage.getItem("jwtToken_business") ||
        !sessionStorage.getItem("jwtToken_expires_business") ||
        !sessionStorage.getItem("businessDisplayName") ||
        !sessionStorage.getItem("businessLegalName") ||
        !sessionStorage.getItem("logoURL")
    ) {
        return false;

    }
    return !Number(sessionStorage.getItem("jwtToken_expires_business") < new Date().getTime());
};