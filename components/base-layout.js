import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Button, View, TextInput } from "react-native";
import FriendPanel from "./friend-panel";
import MapWebview from "./map/map-webview";
import { FAB } from "@rneui/themed";
import RequestPopup from "./request-popup";
import axiosInstance from "../axios-instance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const BaseLayout = () => {

    const [ showSidePanel, setShowSidePanel ] = useState( false );

    const [ modalVisible, setModalVisible ] = useState( false );

    const [ syncRequests, setSyncRequests ] = useState( [] );

    const [ token, setToken ] = useState( null );

    const [ phoneNumber, setPhoneNumber ] = useState( "" );

    async function checkLoggedIn() {
        const token = JSON.parse( await AsyncStorage.getItem( "jwtToken" ) );
        if ( token != null ) {
            setToken( token );
            const sleep = duration => new Promise( resolve => setTimeout( resolve, duration ) );
            const poll = ( promiseFn, duration ) => promiseFn().then(
                    sleep( duration ).then( () => poll( promiseFn, duration ) ) );
            poll( () => new Promise(
                    () => axiosInstance.get( "/permission/get-request-from-friend",
                            { headers: { Authorization: "Bearer " + token } } )
                            .then( ( response ) => {
                                setSyncRequests( response );
                            } ) ), 10000 );
        }
    }

    checkLoggedIn();

    const login = () => {
        axiosInstance.post( "/users/login", { telefon: phoneNumber } ).then( r => {
            AsyncStorage.setItem( "jwtToken", JSON.stringify( r.data.token ) );
            setToken( JSON.stringify( r.data.token ) );
        } ).catch( ( err ) => console.log( err ) );
    };


    const togglePanel = () => {
        setShowSidePanel( !showSidePanel );
    };

    const acceptRequest = ( request, accepted ) => {
        if ( accepted ) {
            axiosInstance.post( "permission/accept-request", { id: request.id, headers: token } );
        } else {
            axiosInstance.post( "permission/decline-request", { id: request.id, headers: token } );
        }
        syncRequests.shift();
    };

    useEffect( () => {
        if ( syncRequests && syncRequests.length > 0 ) {
            setModalVisible( true );
        } else {
            setModalVisible( false );
        }
    }, [ syncRequests ] );

    if ( !token ) {
        return (
                <View style={ { marginTop: "20%" } }>
                    <TextInput value={ phoneNumber } onChangeText={ setPhoneNumber }></TextInput>
                    <Button title={ "Abschicken" } onPress={ login }/>
                </View> );
    }

    return (
            <SafeAreaView style={ styles.baseLayout }>
                <FAB //Friends Button
                        style={ styles.friendsButton }
                        icon={ { type: "ionicons", name: "people", color: "white" } }
                        color="green"
                        onPress={ togglePanel }
                />
                <RequestPopup style={ styles.popup } modalVisible={ modalVisible } syncRequests={ syncRequests }
                              acceptRequest={ acceptRequest } request={ syncRequests[ 0 ] }/>

                { showSidePanel && <FriendPanel style={ styles.panel } token={ token }/> }

                <MapWebview/>

            </SafeAreaView>
    );
};


const styles = StyleSheet.create( {
    baseLayout: {
        flex: 1,
        zIndex: 0
    },
    panel: {
        position: "absolute",
        zIndex: 2,
        height: "100%"

    },
    friendsButton: {
        position: "absolute",
        right: 0,
        top: 0,
        marginRight: 10,
        marginTop: 10,
        height: 50,
        width: 50,
        zIndex: 1
    }

} );

export default BaseLayout;