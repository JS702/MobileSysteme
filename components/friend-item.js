import { Button, StyleSheet, Text, View } from "react-native";
import axiosInstance from "../axios-instance";
import { useEffect, useState } from "react";
import { transformNumber } from "../common/transformNumber";

const FriendItem = ( { friendData, trackedFriend, setTrackedFriend, friendsTracking, setFriendsTracking, trackFriend, token } ) => {

    const [ isTracked, setIsTracked ] = useState( false );

    const [ isTracking, setIsTracking ] = useState( false );


    useEffect( () => {
        if ( trackedFriend && trackedFriend.number === friendData.phoneNumbers[ 0 ].number ) {
            setIsTracked( true );
        }
    }, [ trackedFriend ] );

    useEffect( () => {
        if ( friendsTracking.length > 0 &&
                friendsTracking.filter( friend => friend.number === transformNumber( friendData.phoneNumbers[ 0 ].number ) ).length > 0 ) {
            setIsTracking( true );
        }
    }, [ friendsTracking ] );



    const stopTracking = () => {
        setTrackedFriend( null );
        setIsTracked( false );
    };


    const stopGettingTracked = () => {
        const friend = friendsTracking.filter( friend => friend.number === transformNumber( friendData.phoneNumbers[ 0 ].number ) );
        axiosInstance.post( "/permission/decline-request", { id: friend._id }, { headers: { Authorization: "Bearer " + token } } );
        setFriendsTracking( friendsTracking.filter( friend => friend.number !== transformNumber( friendData.phoneNumbers[ 0 ].number ) ) );
        setIsTracking( false );
    };

    return (
            <View>
                <Text style={ styles.item }>{ friendData.name }</Text>
                { !isTracked &&
                        <Button title={ "Find" } disabled={ trackedFriend?.status === "pending" }
                                onPress={ () => trackFriend( transformNumber( friendData.phoneNumbers[ 0 ].number ) ) }/> }
                { isTracked && <Button title={ "Stop" } onPress={ stopTracking }/> }
                { isTracking && <Button title={ "Disconnect" } onPress={ stopGettingTracked }/> }
            </View>

    );
};

const styles = StyleSheet.create( {
    item: {
        marginLeft: 10,
        color: "white",
    }

} );
export default FriendItem;