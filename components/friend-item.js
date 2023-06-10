import { Button, StyleSheet, Text, View } from "react-native";
import axiosInstance from "../axios-instance";
import { useEffect, useState } from "react";

const FriendItem = ( { friendData, trackedFriends, setTrackedFriends, token } ) => {

    const [ isTracked, setIsTracked ] = useState( false );

    useEffect( () => {
        if ( trackedFriends.length > 0 && trackedFriends.include( friendData ) ) {
            setIsTracked( true );
        }
    }, [ trackedFriends ] );

    const locationRequest = () => {
        axiosInstance.post( "/permission/permission-request", { friendsTelefon: friendData.phoneNumbers[ 0 ].number },
                { headers: { Authorization: "Bearer " + token } } ).then( ( r ) => {
            setTrackedFriends( [ ...trackedFriends, friendData ] );
        } );
    };

    const stopTracking = () => {
        setTrackedFriends( trackedFriends.filter( friend => friend !== friendData ) );
        setIsTracked( false );
    };

    return (
            <View>
                <Text style={ styles.item }>{ friendData.name }</Text>
                <Button title={ "Find" } onPress={ locationRequest }/>
                { isTracked && <Button title={ "Stop" } onPress={ stopTracking }/> }
            </View>

    );
};

const styles = StyleSheet.create( {
    item: {
        marginLeft: 10
    }

} );
export default FriendItem;