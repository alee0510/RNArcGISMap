import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { MD3Colors } from 'react-native-paper';

import IconButton from "@/components/ui/IconButton.tsx";
import ButtonNavBar from "@/components/BottonNavBar.tsx";
import ReCenterButton from '@/components/feature/ReCenterButton.tsx';
import ArcGISMapView from "@/native/NativeArcGISMapViewNativeComponent.ts"

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
            <View style={styles.zoomaction}>
                <IconButton icon="plus" border={1} />
                <IconButton icon="minus" border={1} />
            </View>
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
    zoomaction: {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        gap: 10,
        bottom: SCREEN_HEIGHT / 2,
        right: 20,
    }
});
