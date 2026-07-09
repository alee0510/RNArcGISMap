import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MD3Colors } from 'react-native-paper';

import ButtonNavBar from "@/components/BottonNavBar.tsx";
import ReCenterButton from '@/components/feature/ReCenterButton.tsx';
import ZoomButton from '@/components/feature/ZoomButton.tsx';
import ArcGISMapView from "@/native/NativeArcGISMapViewNativeComponent.ts"

export default function HomeScreen() {
    const [isCentered, setIsCentered] = useState(true);
    return (
        <View style={styles.container}>
            <ArcGISMapView style={styles.map} onMapCenterStateChange={e => {
                if (isCentered !== e.nativeEvent.isCentered) {
                    setIsCentered(e.nativeEvent.isCentered)
                }
            }} />
            <ButtonNavBar />
            <ReCenterButton isCentered={isCentered} />
            <ZoomButton />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MD3Colors.primary90
    },
    map: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    },
});
