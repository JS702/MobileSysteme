import { StyleSheet, Text } from "react-native";

const FriendItem = ( { friendData } ) => {

    return (
            <Text style={ styles.item }>{ friendData.name }</Text>
    );
};

const styles = StyleSheet.create( {
    item: {
        marginLeft: 10
    }
} );
export default FriendItem;