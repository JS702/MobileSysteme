import { Text } from "react-native";

const FriendItem = ( { friendData } ) => {

    return (
            <Text>{ friendData.name }</Text>
    );
};

export default FriendItem;