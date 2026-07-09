import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MD3Colors } from 'react-native-paper';

import BottomNavBar from "@/components/feature/BottomNavBar.tsx";
import MapStyleBottomSheet from '@/components/feature/MapStyleBottomSheet.tsx';
import ReCenterButton from '@/components/feature/ReCenterButton.tsx';
import ZoomButton from '@/components/feature/ZoomButton.tsx';
import { LandMarks } from "@/misc/consts.ts"
import ArcGIsMapModule from "@/native/NativeArcGISMapModule.ts"
import ArcGISMapView from "@/native/NativeArcGISMapViewNativeComponent.ts"

export default function HomeScreen() {
    const [isCentered, setIsCentered] = useState(false);
    const [pinJSON, setPinJSON] = useState("[]")
    const [focusedId, setFocusedId] = useState("01")
    const onTabFocus = async (id: string) => {
        setFocusedId(id)
        if (id === "02") {
            setPinJSON(JSON.stringify(LandMarks))
            return
        }

        if (id === "03") {
            setPinJSON("[]")
            await ArcGIsMapModule.computeRoute(JSON.stringify([-7.138542, 111.155120, -7.133210, 111.176450]))
            return
        }

        setPinJSON("[]")
        await ArcGIsMapModule.clearRoute()
    }

    return (
        <View style={styles.container}>
            <ArcGISMapView
                style={styles.map}
                pinsJson={pinJSON}
                onMapCenterStateChange={e => {
                    if (isCentered !== e.nativeEvent.isCentered) {
                        setIsCentered(e.nativeEvent.isCentered)
                    }
                }}
            />
            <BottomNavBar focusId={focusedId} onTabFocus={onTabFocus} />
            <ReCenterButton isCentered={isCentered} />
            <ZoomButton />
            <MapStyleBottomSheet />
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
