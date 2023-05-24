import { Button, FlatList } from "react-native";
import FriendItem from "./friend-item";
import { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { styles } from "../styles";

const FriendPanel = () => {

    const [ sidePanelWidth, setSidePanelWidth ] = useState( "0%" );
    const [ buttonVisibility, setButtonVisibility ] = useState( "" );
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

    const onButtonPress = () => {
        setSidePanelWidth( "50%" );
        setButtonVisibility( "hidden" );
    };


    return (
            <>
                <Button title={ "FriendsButton" } onPress={ onButtonPress }>Freunde</Button>
                <FlatList
                        style={ { ...styles.sidebar, width: sidePanelWidth } }
                        data={ contacts }
                        renderItem={ ( { item } ) => <FriendItem friendData={ item }/> }
                        keyExtractor={ item => item?.id?.toString() }
                />
            </>
    );
};

export default FriendPanel;