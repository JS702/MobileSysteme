import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Button, View, TextInput } from "react-native";
import FriendPanel from "./friend-panel";
import MapWebview from "./map/map-webview";
import { FAB } from "@rneui/themed";
import RequestPopup from "./request-popup";
import axiosInstance from "../axios-instance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useInterval } from "../common/useIntervall";

const BaseLayout = () => {

    const [ token, setToken ] = useState( null );

    const [ phoneNumber, setPhoneNumber ] = useState( "" );

    const [ showSidePanel, setShowSidePanel ] = useState( false );

    const [ modalVisible, setModalVisible ] = useState( false );

    const [ syncRequests, setSyncRequests ] = useState( [] );

    const [ pendingSyncRequests, setPendingSyncRequests ] = useState( [] );

    const [ trackedFriend, setTrackedFriend ] = useState( null );

    const [ acceptedTracking, setAcceptedTracking ] = useState( false );

    const [ friendsTracking, setFriendsTracking ] = useState( [] );

    async function checkLoggedIn() {
        const token = JSON.parse( await AsyncStorage.getItem( "jwtToken" ) );
        if ( token != null ) {
            setToken( token );
        }
    }

    checkLoggedIn();

    useInterval( async () => {
        if ( token ) {
            const response = await axiosInstance.get( "/permission/get-request-from-friend",
                    { headers: { Authorization: "Bearer " + token } } );
            if ( response.data && response.data.length > 0 ) {
                setSyncRequests( response.data );
                setPendingSyncRequests( response.data.filter( request => request.status === "pending" ) );
            }
        }
    }, 10000 );

    useInterval( async () => {
        if ( trackedFriend && !acceptedTracking ) {
            axiosInstance.post( "/permission/get-request", { friendsTelefon: trackedFriend.number },
                    { headers: { Authorization: "Bearer " + token } } ).then( ( r ) => {
                if ( r.data.status === "accepted" ) {
                    setAcceptedTracking( true );
                    setTrackedFriend( { number: trackedFriend.number, status: "accepted" } );
                }
                if ( r.data.status === "declined" ) {
                    setTrackedFriend( null );
                }
            } );
        }
    }, 5000 );

    const locationRequest = ( number ) => {
        axiosInstance.post( "/permission/permission-request", { friendsTelefon: number },
                { headers: { Authorization: "Bearer " + token } } ).then( ( r ) => {
            setTrackedFriend( { number: number, status: r.data.status } );
        } );
    };

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
            axiosInstance.post( "/permission/accept-request", { id: request._id }, { headers: { Authorization: "Bearer " + token } } )
                    .then( r => {
                        setFriendsTracking( [ ...friendsTracking, { number: r.data.user, requestId: request._id } ] );
                        setPendingSyncRequests( pendingSyncRequests.slice( 1 ) );
                    } );
        } else {
            setPendingSyncRequests( pendingSyncRequests.slice( 1 ) );
            axiosInstance.post( "/permission/decline-request", { id: request._id }, { headers: { Authorization: "Bearer " + token } } );
        }
    };

    const stopGettingTracked = () => {
        axiosInstance.delete( "/permission/delete-all-request", { headers: { Authorization: "Bearer " + token } } ).then( ( r ) => {
            setFriendsTracking( [] );
        } );
    };

    useEffect( () => {
        if ( pendingSyncRequests && pendingSyncRequests.length > 0 ) {
            setModalVisible( true );
        } else {
            setModalVisible( false );
        }
    }, [ pendingSyncRequests ] );


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
                <RequestPopup style={ styles.popup } modalVisible={ modalVisible } syncRequests={ pendingSyncRequests }
                              acceptRequest={ acceptRequest } request={ pendingSyncRequests[ 0 ] }/>

                { showSidePanel && <FriendPanel style={ styles.panel } token={ token } trackedFriend={ trackedFriend }
                                                setTrackedFriend={ setTrackedFriend } friendsTracking={ friendsTracking }
                                                setFriendsTracking={ setFriendsTracking } trackFriend={ locationRequest }/> }

                <MapWebview trackedFriend={ trackedFriend } setTrackedFriend={ setTrackedFriend } token={ token } setAcceptedTracking={ setAcceptedTracking }/>

                { friendsTracking.length > 0 && <Button title={ "Stop getting Tracked" } onPress={ stopGettingTracked }/> }

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
        height: "100%",
        width: "33%"
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