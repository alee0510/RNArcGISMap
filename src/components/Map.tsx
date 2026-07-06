import { StyleSheet } from "react-native"
import { useLocationStore } from "@/hooks/useLocation.ts"
import ArcGISMapView from "@/native/NativeArcGISMapViewNativeComponent.ts"

export default function Map() {
    const { location } = useLocationStore()
    return (
        <ArcGISMapView
            style={styles.map}
            latitude={location?.latitude}
            longitude={location?.longitude}
            zoomScale={70000.0}
        />
    )
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