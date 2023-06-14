import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, StatusBar, Button, Alert, View, Linking } from "react-native";
import WebView from "react-native-webview";
import * as Location from "expo-location";
import { Slider, FAB } from "@rneui/themed";
import { useInterval } from "../../common/useIntervall";
import axiosInstance from "../../axios-instance";
import html_script from "./html_script";
import Compass from "../compass";

const OWN_MARKER = "ownMarker";
const FRIEND_MARKER = "friendMarker";

const MapWebview = ( { trackedFriends, token } ) => {

    const mapRef = useRef( null );

    const [ ownLocation, setOwnLocation ] = useState( {
        lat: 37.78825,
        lng: -122.4324
    } );

    const [ friendLocation, setFriendLocation ] = useState( {
        lat: 0,
        lng: 0
    } );

    const [ latSliderValue, setLatSliderValue ] = useState( 0 );
    const [ lngSliderValue, setLngSliderValue ] = useState( 0 );

    const [ isRouting, setIsRouting ] = useState( false );
    const [ friendMarkerAdded, setFriendMarkerAdded ] = useState( false );
    const [ routeButtonColor, setRouteButtonColor ] = useState( "green" );

    const [ isShowingDirections, setIsShowingDirections ] = useState( false );
    const [ directionsButtonColor, setDirectionsButtonColor ] = useState( "green" );

    const [ firstRender, setFirstRender ] = useState( true );


    const verifyPermissions = async () => {
        const result = await Location.requestForegroundPermissionsAsync();
        if ( result.status !== "granted" ) {
            Alert.alert( "No Permissions!", "Please give location permissions to use this app.", [ { title: "Ok" } ] );
            return false;
        } else {
            return true;
        }
    };

    const getLocationHandler = async () => {
        const hasPermission = await verifyPermissions();
        if ( !hasPermission ) {
            return;
        }
        try {
            const location = await Location.getCurrentPositionAsync( { timeout: 5000 } );
            setOwnLocation( { lat: location.coords.latitude, lng: location.coords.longitude } );
        } catch ( err ) {
            Alert.alert( "Could not get location!", "Please try again later and make sure your location is enabled", [ { title: "Ok" } ] );
        }
    };

    const centerOnPosition = ( lat, lon, zoom ) => {
        mapRef.current.injectJavaScript( `
            map.setView([${ lat }, ${ lon }], ${ zoom });
        ` );
    };

    const setMarker = ( marker, lat, lon ) => {
        mapRef.current.injectJavaScript( `
            ${ marker }.setLatLng([${ lat }, ${ lon }]);
        ` );
    };

    const addMarker = ( name, lat, lon, popupText ) => {
        if (popupText == undefined) {
            mapRef.current.injectJavaScript( `
                var ${ name } = L.marker([${ lat }, ${ lon }]).addTo(map);
            ` );
        } else {
            mapRef.current.injectJavaScript( `
                var ${ name } = L.marker([${ lat }, ${ lon }]).addTo(map).bindPopup('<p align="center"> ${ popupText } </p>');
            ` );
        }
    };

    const changeMarkerColor = ( name, color ) => {
        //Color = Red / Green / Blue / Purple / Yellow
        mapRef.current.injectJavaScript( `
            ${ name }._icon.classList.add("hueChange${ color }");
        ` );
    };

    const removeMarker = ( name ) => {
        mapRef.current.injectJavaScript( `
            ${ name }.remove();
        ` );
        setFriendMarkerAdded( false );
    };

    const addRoute = ( startLat, startLon, endLat, endLon ) => {
        mapRef.current.injectJavaScript( `
        if (routingControl != null) {
            map.removeControl(routingControl);
            routingControl = null;
        }
        routingControl = L.Routing.control({
            waypoints: [
              L.latLng(${ startLat }, ${ startLon }),
              L.latLng(${ endLat }, ${ endLon })
            ],
            createMarker: function() { return null; }
          }).addTo(map);
          routingControl.hide();
        ` );
        setIsRouting( true );
    };

    const removeRoute = () => {
        mapRef.current.injectJavaScript( `
        map.removeControl(routingControl);
        routingControl = null;
        ` );
        setIsRouting( false );
    };

    const hideDirections = () => {
        mapRef.current.injectJavaScript( `
        routingControl.hide();
        ` );
    };

    const showDirections = () => {
        mapRef.current.injectJavaScript( `
        routingControl.show();
        ` );
    };

    useEffect( () => {
        getLocationHandler();
        setFirstRender(false);
    }, [] );

    useEffect( () => {
        centerOnPosition( ownLocation.lat, ownLocation.lng, 16 );
        setMarker( OWN_MARKER, ownLocation.lat, ownLocation.lng );
    }, [ ownLocation ] );

    useEffect( () => {
        if (!firstRender) {
            if (!friendMarkerAdded) {
                addMarker( FRIEND_MARKER, friendLocation.lat, friendLocation.lng, "Hallo" );
                changeMarkerColor( FRIEND_MARKER, "Red");
                setFriendMarkerAdded( true );
            } else {
                setMarker( FRIEND_MARKER, friendLocation.lat, friendLocation.lng );
                mapRef.current.injectJavaScript( `
                routingControl.setWaypoints([
                    L.latLng(${ ownLocation.lat }, ${ ownLocation.lng }),
                    L.latLng(${ friendLocation.lat }, ${ friendLocation.lng })
                ]);
                ` );
            }
        }
        
    }, [ friendLocation ] );

    useInterval( async () => {
        if ( trackedFriends.length > 0 ) {
            console.log( "Getting friend location..." );
            const friends = await Promise.all( trackedFriends.map(
                    friend => axiosInstance.post( "/permission/get-location-from-friend",
                            { friendsTelefon: friend }, { headers: { Authorization: "Bearer " + token } } ) ) );
            //erstmal immer nur den ersten Freund tracken
            if ( friends[ 0 ].hasOwnProperty( "location" ) ) {
                setFriendLocation( { lat: friends[ 0 ].location.latitude, lng: friends[ 0 ].location.longitude } );
            }
            console.log( "Got friend location" );
        }
    }, 10000 );


    /** DEBUG FUNCTIONS */

    const latSliderHandler = ( value ) => {
        setLatSliderValue( value );
        setFriendLocation( {
            lat: value,
            lng: friendLocation.lng
        } );
    };

    const lngSliderHandler = ( value ) => {
        setLngSliderValue( value );
        setFriendLocation( {
            lat: friendLocation.lat,
            lng: value
        } );
    };

    return (
            <>
                <StatusBar barStyle="dark-content"/>
                <View style={ styles.compassWrapper } pointerEvents="box-none">
                    { friendMarkerAdded && <Compass style={ styles.compass } angle={ 90 } ownLocation={ ownLocation } friendLocation={ friendLocation }/> }
                </View>
                <SafeAreaView style={ styles.Container }>
                    <WebView
                            ref={ mapRef }
                            source={ { html: html_script } }
                            style={ styles.Webview }
                            onShouldStartLoadWithRequest={(request) => {
                                if(request.url !== "about:blank") {
                                    Linking.openURL(request.url)
                                    return false
                                } else return true
                            }}
                              
                    />
                    <FAB //Center Button
                            style={ styles.centerButton }
                            icon={ { type: "ionicon", name: "locate", color: "white" } }
                            color="green"
                            onPress={ () => {
                                centerOnPosition( ownLocation.lat, ownLocation.lng, 16 );
                                setMarker( OWN_MARKER, ownLocation.lat, ownLocation.lng );
                            } }
                    />
                    <FAB //Route Button
                            style={ styles.routeButton }

                            icon={ {
                                ...isRouting ? { type: "ionicons", name: "close", color: "white" } : {
                                    type: "feather",
                                    name: "corner-up-right",
                                    color: "white"
                                }
                            } }
                            color={ routeButtonColor }
                            disabled={ !friendMarkerAdded }
                            onPress={ () => {
                                if ( !isRouting ) {
                                    addRoute( ownLocation.lat, ownLocation.lng, friendLocation.lat, friendLocation.lng );
                                    setRouteButtonColor( "red" );
                                } else {
                                    removeRoute();
                                    setRouteButtonColor( "green" );
                                }
                            } }
                    />

                    { isRouting && <FAB //Directions Button
                            style={ styles.directionsButton }

                            icon={ { type: "fontisto", name: "direction-sign", color: "white" } }
                            color={ directionsButtonColor }
                            disabled={ !friendMarkerAdded }
                            onPress={ () => {
                                setIsShowingDirections( !isShowingDirections );
                                if ( isShowingDirections ) {
                                    hideDirections();
                                    setDirectionsButtonColor( "green" );
                                } else {
                                    showDirections();
                                    setDirectionsButtonColor( "red" );
                                }
                            } }
                    /> }
                </SafeAreaView>

                {/* DEBUG BUTTONS*/ }
                <Button title="Remove" onPress={ () => {
                    if (friendMarkerAdded) {
                        removeMarker( FRIEND_MARKER );
                        setFriendMarkerAdded( false );
                    }
                } }/>
                <Slider
                        value={ latSliderValue }
                        onValueChange={ ( value ) => latSliderHandler( value ) }
                        minimumValue={ -90 }
                        maximumValue={ 90 }
                        step={ 1 }
                />
                <Slider
                        value={ lngSliderValue }
                        onValueChange={ ( value ) => lngSliderHandler( value ) }
                        minimumValue={ -180 }
                        maximumValue={ 180 }
                        step={ 1 }
                />
            </>
    );
};

const styles = StyleSheet.create( {
    Container: {
        flex: 1,
        padding: 0,
        backgroundColor: "grey",
        textAlign: "center"
    },
    Webview: {
        flex: 2
    },
    centerButton: {
        position: "absolute",
        right: 0,
        bottom: 0,
        marginRight: 10,
        marginBottom: 10,
        height: 50,
        width: 50
    },
    routeButton: {
        position: "absolute",
        right: 0,
        bottom: 60,
        marginRight: 10,
        marginBottom: 10,
        height: 50,
        width: 50
    },
    directionsButton: {
        position: "absolute",
        right: 0,
        bottom: 120,
        marginRight: 10,
        marginBottom: 10,
        height: 50,
        width: 50
    },
    compass: {
        height: 100,
        width: 100
    },
    compassWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1
    }
} );

export default MapWebview;