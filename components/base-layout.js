import { SafeAreaView, StyleSheet } from "react-native";
import FriendPanel from "./friend-panel";
import MapWebview from "./map/map-webview";

const BaseLayout = () => {
    return (
            <SafeAreaView style={ styles.baseLayout }>
                <FriendPanel style={ styles.panel }/>
                
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

    }
} );

export default BaseLayout;