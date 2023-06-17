import { Button, FlatList, View } from "react-native";
import FriendItem from "./friend-item";
import { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { StyleSheet } from "react-native";
import axiosInstance from "../axios-instance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { transformNumber } from "../common/transformNumber";
import { Icon } from "@rneui/themed";


const FriendPanel = ( { style, token, trackedFriend, setTrackedFriend, friendsTracking, setFriendsTracking, trackFriend } ) => {

    const [ contacts, setContacts ] = useState( [] );
    const setCachedContacts = async () => {
        const cachedContacts = JSON.parse( await AsyncStorage.getItem( "contacts" ) );
        setContacts( cachedContacts );
    };
    setCachedContacts();

    const buildPayload = ( data ) => {
        return data.map( contact => contact.phoneNumbers[ 0 ].number.replaceAll( " ", "" ) );
    };

    const refreshContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if ( status === "granted" ) {
            const { data } = await Contacts.getContactsAsync( {
                fields: [ Contacts.Fields.PhoneNumbers, Contacts.Fields.Name ]
            } );
            if ( data.length > 0 ) {
                axiosInstance.post( "/users/get-all-registered-friends", {
                    listOfFriends: buildPayload( data )
                } )
                        .then( ( response ) => {
                            const filteredContacts = data.filter(
                                    contact => response.data.includes( transformNumber( contact.phoneNumbers[ 0 ].number ) ) );
                            setContacts( filteredContacts );

                            AsyncStorage.setItem( "contacts", JSON.stringify( filteredContacts ) );
                        } ).catch( ( err ) => console.log( err ) );

            }
        }
    };

    return (
            <View style={ style }>
                <Icon
                    type="ionicons"
                    name="refresh"
                    color="white"
                    size={30}
                    style={ styles.refreshButton }
                    onPress= { refreshContacts }
                />
                <View style={ styles.sidebar }>
                    <FlatList
                            data={ contacts }
                            renderItem={ ( { item } ) => <FriendItem friendData={ item } trackedFriend={ trackedFriend }
                                                                     setTrackedFriend={ setTrackedFriend } token={ token }
                                                                     friendsTracking={ friendsTracking }
                                                                     setFriendsTracking={ setFriendsTracking }
                                                                     trackFriend={ trackFriend }/> }
                            keyExtractor={ item => item?.id?.toString() }
                    />
                </View>
            </View>
    );
};


const styles = StyleSheet.create( {
    sidebar: {
        height: "100%",
        borderBottomRightRadius: 10,
        marginLeft: 0,
        backgroundColor: "#00000088"
    },
    refreshButton: {
        resizeMode: "contain",
        backgroundColor: "#00000088",
        borderTopRightRadius: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 3,
        borderBottomColor: "#b3b3b3"
    },
} );

export default FriendPanel;