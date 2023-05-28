import { Pressable, StyleSheet, Text } from "react-native";

const FriendItem = ( { friendData } ) => {

    return (
            <Pressable>
                <Text style={ styles.item }>{ friendData.name }</Text>
            </Pressable>
    );
};

const styles = StyleSheet.create( {
    item: {
        marginLeft: 10
    }
} );
export default FriendItem;