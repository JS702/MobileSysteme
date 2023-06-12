import React, { useState, useEffect } from "react";
import { Image, View } from "react-native";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Magnetometer } from "expo-sensors";
import { Icon } from "@rneui/themed";


const Compass = ( { style } ) => {

    const [ subscription, setSubscription ] = useState( null );
    const [ magnetometer, setMagnetometer ] = useState( 0 );


    useEffect( () => {
        _toggle();
        return () => {
            _unsubscribe();
        };
    }, [] );

    const _toggle = () => {
        if ( subscription ) {
            _unsubscribe();
        } else {
            _subscribe();
        }
    };

    const _subscribe = () => {
        setSubscription(
                Magnetometer.addListener( ( data ) => {
                    setMagnetometer( _angle( data ) );
                } )
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription( null );
    };

    const _angle = ( magnetometer ) => {
        let angle = 0;
        if ( magnetometer ) {
            let { x, y, z } = magnetometer;
            if ( Math.atan2( y, x ) >= 0 ) {
                angle = Math.atan2( y, x ) * 180 / Math.PI;
            } else {
                angle = Math.atan2( y, x ) * 180 / Math.PI;
            }
        }
        return Math.round( angle );
    };

    // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
    const _degree = ( magnetometer ) => {
        return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
    };

    return (
        <View style={ { backgroundColor:  "#00000088",
                        borderRadius: 90,
                        marginTop: 8,
                        width: 60,
                        height: 60,
                        justifyContent: "center",
                        alignItems: "center"
                    } }>
        {/*
            <Grid style={ { backgroundColor: "black", ...style } }>
                <Row style={ { alignItems: "flex-end" } } size={ 0.2 }>
                    <Col style={ { width: style.width, alignItems: "center" } }>
                        <Image source={ require( "../assets/compass_pointer.png" ) } style={ {
                            height: style.height / 13, resizeMode: "contain", marginBottom: 0
                        } }/>
                    </Col>
                </Row>

                <Row style={ { alignItems: "flex-start" } } size={ 2 }>
                    <Col style={ { alignItems: "center" } }>
                        <Image source={ require( "../assets/compass_bg.png" ) } style={ {
                            height: style.width * 0.8,
                            justifyContent: "center",
                            alignItems: "center",
                            resizeMode: "contain",
                            transform: [ { rotate: 360 - magnetometer + "deg" } ]
                        } }/>
                    </Col>
                </Row>
            </Grid>
                    */}

            <Icon
                type="entypo"
                name="direction"
                color="white"
                size={30}
                style={ {
                    resizeMode: "contain",
                    transform: "".concat("rotate(", 45 - 360 - magnetometer, "deg)"),
                } }   
            />
        </View>
    );
};


export default Compass;
