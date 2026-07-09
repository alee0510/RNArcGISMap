import { Dimensions, StyleSheet, View } from "react-native"
import IconButton from "@/components/ui/IconButton.tsx"

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export default function ZoomButton() {
    return (
        <View style={styles.container}>
            <IconButton icon="plus" border={1} />
            <IconButton icon="minus" border={1} />
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