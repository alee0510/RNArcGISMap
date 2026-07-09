import { StyleSheet, View } from "react-native"
import { MD3Colors } from "react-native-paper"
import IconButton from "@/components/ui/IconButton.tsx";

export default function ButtonNavBar() {
    return (
        <View style={styles.container}>
            <IconButton icon="map" active={true} space={15} />
            <IconButton icon="pin" space={15} inactiveBackgroundColor={MD3Colors.primary40} />
            <IconButton icon="routes" space={15} inactiveBackgroundColor={MD3Colors.primary40} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MD3Colors.primary40,
        borderRadius: 50,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 4,
        marginHorizontal: "25%",
        marginVertical: 20,
        position: "absolute",
        bottom: 20,
        width: "50%",
    },
});
