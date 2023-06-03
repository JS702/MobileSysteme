import { Button, FlatList, Pressable, View, Text } from "react-native";
import FriendItem from "./friend-item";
import { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { StyleSheet } from "react-native";


const FriendPanel = ( { style } ) => {

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
                    //TODO filter contacts by people who have our app -> number is in Database
                    setContacts( data );
                }
            }
        } )();
    }, [] );


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