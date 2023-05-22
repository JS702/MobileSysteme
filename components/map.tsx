import * as React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { LatLng, LeafletView } from "../react-native-leaflet-expo-main/src"; //Grüße gehen raus an "lichtmetzger" von github, der mit seinem fork von react-native-leaflet-view den Fehler gefixt hat, der mich in die Verzweiflung getrieben hat

const DEFAULT_COORDINATE: LatLng = {
  lat: 37.78825,
  lng: -122.4324,
};

const Map = () => {

    return (
      <SafeAreaView style={styles.root}>
      <LeafletView
        mapMarkers={[
          {
            position: DEFAULT_COORDINATE,
            icon: '📍',
            size: [32, 32],
          },
        ]}
        mapCenterPosition={DEFAULT_COORDINATE}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        padding: 10,
        backgroundColor: "grey",
      },
      Webview: {
        flex: 1,
      },
      root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
});

export default Map;