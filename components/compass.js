import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Magnetometer } from "expo-sensors";
import { Icon } from "@rneui/themed";


const Compass = ( { angle, ownLocation, friendLocation } ) => {

    const [ subscription, setSubscription ] = useState( null );
    const [ magnetometer, setMagnetometer ] = useState( 0 );


    useEffect( () => {
        _toggle();
        return () => {
            _unsubscribe();
        };
    }, [] );

    const caculauteDir = () => {
        const vector = [ friendLocation.lng - ownLocation.lng, friendLocation.lat - ownLocation.lat ];
        const theta = angle * 180 / Math.PI;

        const cs = Math.cos( theta );
        const sn = Math.sin( theta );

        const x = ( ownLocation.lat + 1 ) * cs - ownLocation.lng * sn;
        const y = ( ownLocation.lat + 1 ) * sn + ownLocation.lng * cs;

        const otherVector = [ x, y ];
        return Math.atan2(  vector[ 0 ] - otherVector[ 0 ], vector[ 1 ] - otherVector[ 1 ] ) * 180 / Math.PI;
    };

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


    return (
        <View style={ { backgroundColor:  "#00000088",
                        borderRadius: 90,
                        marginTop: 8,
                        width: 60,
                        height: 60,
                        justifyContent: "center",
                        alignItems: "center"
                    } }>

            <Icon
                type="entypo"
                name="direction"
                color="white"
                size={30}
                style={ {
                    resizeMode: "contain",
                    transform: "".concat( "rotate(", 45 - 360 - magnetometer + caculauteDir(), "deg)" )
                } }   
            />
        </View>
    );
};


export default Compass;
