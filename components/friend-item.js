import { Button, StyleSheet, Text, View } from "react-native";
import axiosInstance from "../axios-instance";
import { useEffect, useState } from "react";
import { transformNumber } from "../common/transformNumber";

const FriendItem = ( { friendData, trackedFriends, setTrackedFriends, friendsTracking, setFriendsTracking, token } ) => {

    const [ isTracked, setIsTracked ] = useState( false );

    const [ isTracking, setIsTracking ] = useState( false );

    useEffect( () => {
    }, [ isTracking, isTracked ] );

    useEffect( () => {
        if ( trackedFriends.length > 0 && trackedFriends.includes( transformNumber( friendData.phoneNumbers[ 0 ].number ) ) ) {
            setIsTracked( true );
        }
    }, [ trackedFriends ] );

    useEffect( () => {
        if ( friendsTracking.length > 0 && friendsTracking.includes( transformNumber( friendData.phoneNumbers[ 0 ].number ) ) ) {
            setIsTracking( true );
        }
    }, [ friendsTracking ] );

    const locationRequest = () => {
        axiosInstance.post( "/permission/permission-request", { friendsTelefon: friendData.phoneNumbers[ 0 ].number },
                { headers: { Authorization: "Bearer " + token } } ).then( ( r ) => {
            setTrackedFriends( [ ...trackedFriends, transformNumber( friendData.phoneNumbers[ 0 ].number ) ] );
        } );
    };

    const stopTracking = () => {
        setTrackedFriends( trackedFriends.filter( friend => friend !== transformNumber( friendData.phoneNumbers[ 0 ].number ) ) );
        setIsTracked( false );
    };


    const stopGettingTracked = () => {
        setFriendsTracking( friendsTracking.filter( friend => friend !== transformNumber( friendData.phoneNumbers[ 0 ].number ) ) );
        setIsTracking( false );
    };

    return (
            <View>
                <Text style={ styles.item }>{ friendData.name }</Text>
                <Button title={ "Find" } onPress={ locationRequest }/>
                { isTracked && <Button title={ "Stop" } onPress={ stopTracking }/> }
                { isTracking && <Button title={ "Disconnect" } onPress={ stopGettingTracked }/> }
            </View>

    );
};

const styles = StyleSheet.create( {
    item: {
        marginLeft: 10
    }

} );
export default FriendItem;