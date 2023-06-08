import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Button, View, TextInput } from "react-native";
import FriendPanel from "./friend-panel";
import MapWebview from "./map/map-webview";
import { FAB } from "@rneui/themed";
import RequestPopup from "./request-popup";
import axiosInstance from "../axios-instance";

const BaseLayout = () => {

    const [ showSidePanel, setShowSidePanel ] = useState( false );

    const [ modalVisible, setModalVisible ] = useState( false );

    const [ syncRequests, setSyncRequests ] = useState( [] );

    const [ isLoggedIn, setIsLoggedIn ] = useState( !!localStorage.getItem( "jwtToken" ) );

    const [ phoneNumber, setPhoneNumber ] = useState( "" );

    const login = () => {
        axiosInstance.post( "/users/login", { telefon: phoneNumber } ).then( r => {
            localStorage.setItem( "jwtToken", r.data.token );
            setIsLoggedIn( true );
        } )
                .catch( ( err ) => console.log( err ) );
    };

    const sleep = duration => new Promise( resolve => setTimeout( resolve, duration ) );
    const poll = ( promiseFn, duration ) => promiseFn().then(
            sleep( duration ).then( () => poll( promiseFn, duration ) ) );
    poll( () => new Promise( () => axiosInstance.get( "/permission/get-request-from-friend" ).then( ( response ) => {
        setSyncRequests( response );
    } ) ), 10000 );


    const togglePanel = () => {
        setShowSidePanel( !showSidePanel );
    };

    const acceptRequest = ( accepted ) => {
        if ( accepted ) {
            //TODO mach iwas
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

    if ( !isLoggedIn ) {
        return (
                <View>
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
                              acceptRequest={ acceptRequest }/>

                { showSidePanel && <FriendPanel style={ styles.panel }/> }

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