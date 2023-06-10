import axios from "axios";

export default axios.create( {
    //baseURL: "https://amaranth-monkey-tam.cyclic.app/api",
    baseURL: "http://[HOSTNAME]:5000/api"
} );