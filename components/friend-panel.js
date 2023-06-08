import { Button, FlatList, Pressable, View, Text } from "react-native";
import FriendItem from "./friend-item";
import { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { StyleSheet } from "react-native";
import axiosInstance from "../axios-instance";


const FriendPanel = ( { style, token } ) => {

    const [ showButton, setShowButton ] = useState( true );
    const [ contacts, setContacts ] = useState( [] );
    useEffect( () => {
        ( async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if ( status === "granted" ) {
                const { data } = await Contacts.getContactsAsync( {
                    fields: [ Contacts.PHONE_NUMBERS ]
                } );
                if ( data.length > 0 ) {
                    setContacts( data );
                    /*
                     axiosInstance.get( "/users/get-all-registered-friends", { listOfFriends: data.map( contact => contact.number ) } )
                     .then( ( response ) => {
                     data.filter( contact => response.includes( transformNumber( contact.number ) ) );
                     setContacts( response );
                     } ).catch( ( err ) => console.log( err ) );

                     */
                }
            }
        } )();
    }, [] );

    const transformNumber = ( number ) => {
        if ( !number.startsWith( "0" ) ) {
            number.replace( "+49", "0" );
        }
        return number;
    };


    return (
            <View style={ style }>
                {
                    <View style={ styles.sidebar }>
                        <FlatList
                                data={ contacts }
                                renderItem={ ( { item } ) => <FriendItem friendData={ item }/> }
                                keyExtractor={ item => item?.id?.toString() }
                        />
                    </View>
                }
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