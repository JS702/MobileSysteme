import { Text } from "react-native";

const FriendItem = ( { friendData } ) => {

    return (
            <Text>{ friendData.title }</Text>
    );
};

export default FriendItem;