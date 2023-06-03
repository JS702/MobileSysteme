import { Button, Pressable, StyleSheet, Text, View } from "react-native";

const FriendItem = ( { friendData } ) => {

    return (
            <View>
                <Text style={ styles.item }>{ friendData.name }</Text>
                <Button title={ "X" }/>
            </View>

    );
};

const styles = StyleSheet.create( {
    item: {
        marginLeft: 10
    }

} );
export default FriendItem;