import { SafeAreaView, StyleSheet } from "react-native";
import FriendPanel from "./friend-panel";

const BaseLayout = () => {
    return (
            <SafeAreaView style={ styles.baseLayout }>
                <FriendPanel style={ styles.panel }/>
            </SafeAreaView>
    );
};


const styles = StyleSheet.create( {
    baseLayout: {
        marginTop: "10%"
    },
    panel: {
        marginTop: 10
    }
} );

export default BaseLayout;