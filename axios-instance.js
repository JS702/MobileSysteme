import axios from "axios";

const headers = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("jwtToken")
            ? {Authorization: "Bearer " + localStorage.getItem("jwtToken")}
            : null;
    }
};

export default axios.create({
    baseURL: "https://amaranth.monkey-tam.cyclic.app/api",
    headers: headers()
});