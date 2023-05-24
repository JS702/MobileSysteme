import {Button, FlatList, Pressable, View} from "react-native";
import FriendItem from "./friend-item";
import {useEffect, useState} from "react";
import * as Contacts from "expo-contacts";
import {StyleSheet} from "react-native";


const FriendPanel = () => {

    const [sidePanelWidth, setSidePanelWidth] = useState("0%");
    const [buttonDisplay, setButtonDisplay] = useState();
    const [contacts, setContacts] = useState([]);
    useEffect(() => {
        (async () => {
            const {status} = await Contacts.requestPermissionsAsync();
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
        setSidePanelWidth("50%");
        setButtonDisplay("none");
    };


    return (
        <>
            <Pressable style={{display: buttonDisplay}}>
                <Button title={"FriendsButton"} onPress={onButtonPress}>Freunde</Button>
            </Pressable>
            <View>
                <FlatList
                    style={{...styles.sidebar, width: sidePanelWidth}}
                    data={contacts}
                    renderItem={({item}) => <FriendItem friendData={item}/>}
                    keyExtractor={item => item?.id?.toString()}
                />
            </View>

        </>
    );
};


const styles = StyleSheet.create({
    baseLayout: {
        marginTop: "10%"
    },
    sidebar: {
        height: "100%",
        marginRight: "auto",
        marginLeft: 0,
        backgroundColor: "#69b8f5"
    }
});

export default FriendPanel;