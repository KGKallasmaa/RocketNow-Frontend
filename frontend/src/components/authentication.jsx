export const isRegularUserLoggedIn = () => {
    if (sessionStorage.getItem("temporary_user_id")) {
        return false;
    }
    if (!sessionStorage.getItem("jwtToken") && !sessionStorage.getItem("jwtToken_expires")) {
        return false;
    }
    return !Number(sessionStorage.getItem("jwtToken_expires") < new Date().getTime());
};