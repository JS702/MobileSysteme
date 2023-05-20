import { FlatList } from "react-native";
import { styles } from "../styles";
import FriendItem from "./friend-item";

const FriendPanel = () => {

    const DATA = [
        {
            id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
            title: "Jon"
        },
        {
            id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
            title: "Stefan"
        },
        {
            id: "58694a0f-3da1-471f-bd96-145571e29d72",
            title: "Vinzent"
        }
    ];

    return (
            <FlatList
                    style={ styles.sidebar }
                    data={ DATA }
                    renderItem={ ( { item } ) => <FriendItem friendData={ item }/> }
                    keyExtractor={ item => item.id }
            />
    );
};

export default FriendPanel;