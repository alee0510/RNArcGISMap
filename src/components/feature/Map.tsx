import { StyleSheet } from "react-native"
import ArcGISMapView from "@/native/NativeArcGISMapViewNativeComponent.ts"

export default function Map() {
    return <ArcGISMapView style={styles.map} onMapCenterStateChange={e => {
        console.log("LOG: onMapCenterStageChange", e.nativeEvent.isCentered)
    }} />
}

const styles = StyleSheet.create({
    map: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    }
})