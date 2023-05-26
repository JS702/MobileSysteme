import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, StatusBar, Button } from "react-native";
import WebView from "react-native-webview";
import * as Location from "expo-location"
import { Slider } from "@rneui/themed";
import html_script from "./html_script";

const OWN_MARKER = "ownMarker";
const FRIEND_MARKER = "friendMarker";

const MapWebview = () => {

    const mapRef = useRef(null);

    const [ownLocation, setOwnLocation] = useState({
    lat: 37.78825,
    lng: -122.4324,
    });

    const [friendLocation, setFriendLocation] = useState({
    lat: 0,
    lng: 0,
    });

    const [latSliderValue, setLatSliderValue] = useState(0);
    const [lngSliderValue, setLngSliderValue] = useState(0);
    
    const verifyPermissions = async () => {
    const result = await Location.requestForegroundPermissionsAsync();
    if (result.status !== "granted") {
        Alert.alert("No Permissions!", "Please give location permissions to use this app.", [{title: "Ok"}]);
        return false;
    } else {
        return true;
    }
    };

    const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
        return
    }
    try {
        const location = await Location.getCurrentPositionAsync({timeout: 5000});
        setOwnLocation({lat: location.coords.latitude, lng: location.coords.longitude});
    } catch (err) {
        Alert.alert("Could not get location!", "Please try again later and make sure your location is enabled", [{title: "Ok"}]);
    }
    };
    
    const centerOnPosition = (lat, lon, zoom) => {
        mapRef.current.injectJavaScript(`
            map.setView([${lat}, ${lon}], ${zoom});
        `)
    }

    const setMarker = (marker, lat, lon) => {
        mapRef.current.injectJavaScript(`
            ${marker}.setLatLng([${lat}, ${lon}]);
        `)
    }

    const addMarker = (name, lat, lon) => {
        mapRef.current.injectJavaScript(`
            const ${name} = L.marker([${lat}, ${lon}]).addTo(map);
        `)
    }

    const addRoute = (startLat, startLon, endLat, endLon) => {
        mapRef.current.injectJavaScript(`
        if (routingControl != null) {
            map.removeControl(routingControl);
            routingControl = null;
        }
        routingControl = L.Routing.control({
            waypoints: [
              L.latLng(${startLat}, ${startLon}),
              L.latLng(${endLat}, ${endLon})
            ],
            createMarker: function() { return null; }
          }).addTo(map);
        `)
    }

    const removeRoute = () => {
        mapRef.current.injectJavaScript(`
        map.removeControl(routingControl);
        routingControl = null;
        `)
    }

    useEffect(() => {
        getLocationHandler();
    }, [])

    useEffect(() => {
        centerOnPosition(ownLocation.lat, ownLocation.lng, 16);
        setMarker(OWN_MARKER, ownLocation.lat, ownLocation.lng);
    }, [ownLocation])

    useEffect(() => {
        setMarker(FRIEND_MARKER, friendLocation.lat, friendLocation.lng);
        mapRef.current.injectJavaScript(`
        routingControl.setWaypoints([
            L.latLng(${ownLocation.lat}, ${ownLocation.lng}),
            L.latLng(${friendLocation.lat}, ${friendLocation.lng})
          ]);
        `)
    }, [friendLocation])


    /** DEBUG FUNCTIONS */

    const latSliderHandler = (value) => {
        setLatSliderValue(value);
        setFriendLocation({
            lat: value,
            lng: friendLocation.lng
        });
    }

    const lngSliderHandler = (value) => {
        setLngSliderValue(value);
        setFriendLocation({
            lat: friendLocation.lat,
            lng: value
        });
    }

    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView style={styles.Container}>
                <WebView
                ref={mapRef}
                source={{ html: html_script }}
                style={styles.Webview}
                />
            </SafeAreaView>

            {/* DEBUG BUTTONS*/}
            <Button title="Center" onPress={() => {
                centerOnPosition(ownLocation.lat, ownLocation.lng, 16);
                setMarker(OWN_MARKER, ownLocation.lat, ownLocation.lng);
                }}/>
             <Button title="Add" onPress={() => {
                addMarker(FRIEND_MARKER, friendLocation.lat, friendLocation.lng);
                }}/>
            <Button title="Start routing" onPress={() => {
                addRoute(ownLocation.lat, ownLocation.lng, friendLocation.lat, friendLocation.lng);
                }}/>
            <Button title="Stop routing" onPress={() => {
                removeRoute();
                }}/>
            <Slider
                value={latSliderValue}
                onValueChange={(value) => latSliderHandler(value)}
                minimumValue={-90}
                maximumValue={90}
                step={1}
              />
            <Slider
                value={lngSliderValue}
                onValueChange={(value) => lngSliderHandler(value)}
                minimumValue={-180}
                maximumValue={180}
                step={1}
              />
        </>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex:1,
        padding: 10,
        backgroundColor: "grey"
    },
    Webview: {
        flex: 2
    }
});

export default MapWebview;