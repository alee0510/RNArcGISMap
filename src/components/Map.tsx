import { StyleSheet } from "react-native"
import { useMapLocation } from "@/hooks/useMapLocation"
import ArcGISMapView from "@/native/NativeArcGISMapViewNativeComponent.ts"

export default function Map() {
    const { location, zoom } = useMapLocation()
    return (
        <ArcGISMapView
            style={styles.map}
            latitude={location?.latitude}
            longitude={location?.longitude}
            zoomScale={zoom}
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