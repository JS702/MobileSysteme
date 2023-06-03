import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Button } from "react-native";
import FriendPanel from "./friend-panel";
import MapWebview from "./map/map-webview";
import { FAB } from "@rneui/themed";

const BaseLayout = () => {

    const [ showSidePanel, setShowSidePanel ] = useState( false );

    const togglePanel = () => {
        setShowSidePanel( !showSidePanel );
    };

    return (
            <SafeAreaView style={ styles.baseLayout }>
                <FAB //Friends Button
                    style={styles.friendsButton}
                    icon={{ type:"ionicons", name: "people", color: 'white' }}
                    color="green"
                    onPress={ togglePanel }
                />
                { showSidePanel && <FriendPanel style={ styles.panel }/> }                
                <MapWebview/>
                
            </SafeAreaView>
    );
};


const styles = StyleSheet.create( {
    baseLayout: {
        flex: 1,
        zIndex: 0,
    },
    panel: {
        position: "absolute",
        zIndex: 1,
        height: "100%",
        //width: "100%",

    },
    friendsButton: {
        position:'absolute',
        right:0,
        top: 0,
        marginRight:10,
        marginTop:10,
        height:50,
        width:50,
        zIndex: 1
    },
} );

export default BaseLayout;