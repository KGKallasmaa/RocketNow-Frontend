const moment = require("moment/moment");
export const formatTimeStamp = (timestamp_UTC) => {
    return moment(timestamp_UTC, "x").fromNow();
};