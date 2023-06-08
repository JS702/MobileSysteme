import axios from "axios";

const headers = () => { // KP ob Stefan header benutzt
    if ( typeof window !== "undefined" ) {
        return localStorage.getItem( "jwtToken" )
                ? { Authorization: "Bearer " + localStorage.getItem( "jwtToken" ) }
                : null;
    }
};

export default axios.create( {
    //baseURL: "https://amaranth-monkey-tam.cyclic.app/api",
    baseURL: "http://[HOSTNAME]:5000/api"
    //headers: headers()
} );