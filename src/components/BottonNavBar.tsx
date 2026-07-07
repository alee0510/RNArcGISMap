import { StyleSheet, View } from "react-native"
import { MD3Colors } from "react-native-paper"
import ActionButton from "@/components/ActionButton.tsx";

export default function ButtonNavBar() {
    return (
        <View style={styles.container}>
            <ActionButton icon="map" active={true} space={15} />
            <ActionButton icon="pin" space={15} inactiveBackgroundColor={MD3Colors.primary40} />
            <ActionButton icon="routes" space={15} inactiveBackgroundColor={MD3Colors.primary40} />
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
