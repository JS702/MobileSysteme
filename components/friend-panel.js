import { FlatList } from "react-native";
import FriendItem from "./friend-item";
import { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";

const FriendPanel = () => {

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
                    console.log( data.length );
                }
            }
        } )();
    }, [] );


    return (
            <>
                <FlatList
                        data={ contacts }
                        renderItem={ ( { item } ) => <FriendItem friendData={ item }/> }
                        keyExtractor={ item => {
                            item?.id?.toString();
                        } }
                />
            </>
    );
};

export default FriendPanel;