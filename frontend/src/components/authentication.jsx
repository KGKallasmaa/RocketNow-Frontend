export const isRegularUserLoggedIn = ()=>{
    if (sessionStorage.getItem("temporary_user_id")) {
        return false;
    }
    if (!sessionStorage.getItem("jwtToken") && !sessionStorage.getItem("jwtToken_expires")) {
        return false;
    }
    return !Number(sessionStorage.getItem("jwtToken_expires") < new Date().getTime());
};

export const isBusinessUserLoggedIn = ()=>{
    if (sessionStorage.getItem("temporary_user_id")) {
        return false;
    }
    if (sessionStorage.getItem("jwtToken")) {
        return false;
    }
    if (!sessionStorage.getItem("business_jwtToken") && !sessionStorage.getItem("jwtToken_expires")) {
        return false;
    }
    return !Number(sessionStorage.getItem("jwtToken_expires") < new Date().getTime());
};