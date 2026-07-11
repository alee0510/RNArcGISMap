import { StyleSheet, View } from "react-native"

import IconButton from "@/components/ui/IconButton.tsx"
import { SCREEN_HEIGHT } from "@/misc/consts.ts"
import ArcGISMapModule from "@/native/NativeArcGISMapModule.ts"

export default function ZoomButton() {
    const handleZoomIn = async () => {
        await ArcGISMapModule.zoomIn()
    }
    const handleZoomOut = async () => {
        await ArcGISMapModule.zoomOut()
    }
    return (
        <View style={styles.container}>
            <IconButton icon="plus" border={1} onPress={handleZoomIn} active={true} />
            <IconButton icon="minus" border={1} onPress={handleZoomOut} active={true} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        position: "absolute",
        top: SCREEN_HEIGHT * 0.4,
        right: 20,
        gap: 10,
    }
})