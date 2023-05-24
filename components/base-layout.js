import { SafeAreaView, StyleSheet } from "react-native";
import FriendPanel from "./friend-panel";
import Map from "./map";

const BaseLayout = () => {
    return (
            <SafeAreaView style={ styles.baseLayout }>
                <FriendPanel/>
                <Map/>
            </SafeAreaView>
    );
};


const styles = StyleSheet.create( {
    baseLayout: {
        marginTop: "10%"
    }
} );

export default BaseLayout;