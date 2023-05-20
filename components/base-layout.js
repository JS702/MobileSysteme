import { SafeAreaView } from "react-native";
import { styles } from "../styles";
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

export default BaseLayout;