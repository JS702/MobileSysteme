import { Button, FlatList, View } from "react-native";
import FriendItem from "./friend-item";
import { useState } from "react";
import * as Contacts from "expo-contacts";
import { StyleSheet } from "react-native";
import axiosInstance from "../axios-instance";
import AsyncStorage from "@react-native-async-storage/async-storage";


const FriendPanel = ( { style, token, trackedFriends, setTrackedFriends, friendsTracking, setFriendsTracking } ) => {

    const [ contacts, setContacts ] = useState( [] );
    const setCachedContacts = async () => {
        const cachedContacts = JSON.parse( await AsyncStorage.getItem( "contacts" ) );
        setContacts( cachedContacts );
    };
    setCachedContacts();

    const buildPayload = ( data ) => {
        return data.map( contact => contact.phoneNumbers[ 0 ].number.replaceAll( " ", "" ) );
    };
    const transformNumber = ( number ) => {
        if ( !number ) {
            return;
        }
        if ( number.startsWith( "+" ) ) {
            number = "0" + number.substring( 3 );
        }
        return number.replaceAll( " ", "" );
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
                <Button title={ "Refresh" } onPress={ refreshContacts }/>
                <View style={ styles.sidebar }>
                    <FlatList
                            data={ contacts }
                            renderItem={ ( { item } ) => <FriendItem friendData={ item } trackedFriends={ trackedFriends }
                                                                     setTrackedFriends={ setTrackedFriends } token={ token }
                                                                     friendsTracking={ friendsTracking }
                                                                     setFriendsTracking={ setFriendsTracking }/> }
                            keyExtractor={ item => item?.id?.toString() }
                    />
                </View>
            </View>
    );
};


const styles = StyleSheet.create( {
    baseLayout: {
        marginTop: "10%"
    },
    sidebar: {
        height: "100%",
        marginLeft: 0,
        marginRight: "auto",
        backgroundColor: "#69b8f5"
    },
    closeButton: {
        marginRight: 5,
        marginLeft: "auto"
    }
} );

export default FriendPanel;