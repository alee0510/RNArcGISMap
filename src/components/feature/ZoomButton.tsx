import { Dimensions, StyleSheet, View } from "react-native"
import IconButton from "@/components/ui/IconButton.tsx"
import ArcGISMapModule from "@/native/NativeArcGISMapModule.ts"

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export default function ZoomButton() {
    const handleZoomIn = async () => {
        await ArcGISMapModule.zoomIn()
    }
    const handleZoomOut = async () => {
        await ArcGISMapModule.zoomOut()
    }
    return (
        <View style={styles.container}>
            <IconButton icon="plus" border={1} onPress={handleZoomIn} />
            <IconButton icon="minus" border={1} onPress={handleZoomOut} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        gap: 10,
        bottom: SCREEN_HEIGHT / 2,
        right: 20,
    }
})