import React from "react";
import { StyleSheet, View, Modal, Text, Button } from "react-native";


const RequestPopup = ( { style, modalVisible, acceptRequest, request } ) => {

    return (
            <Modal style={ style } animationType={ "slide" } visible={ modalVisible } transparent={ true }>
                <View style={ styles.container }>
                    <Text style={ styles.text }>Sync with { request?.user }</Text>
                    <View style={ styles.container2 }>
                        <Button title={ "Decline" } onPress={ () => acceptRequest( request, false ) }/>
                        <Button title={ "Accept" } onPress={ () => acceptRequest( request, true ) }/>
                    </View>
                </View>
            </Modal>
    );
};
const styles = StyleSheet.create( {
    container: {
        marginTop: "70%",
        marginLeft: "15%",
        alignItems: "center",
        backgroundColor: "white",
        width: "70%",
        height: "30%",
        flexDirection: "column"
    },
    container2: {
        flexDirection: "row",
        padding: "5%"
    },
    text: {
        fontSize: 16
    }

} );


export default RequestPopup;