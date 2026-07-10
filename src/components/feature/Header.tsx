import { Text, MD3Colors } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
// import ActionButton from "@/components/ActionButton.tsx";

export default function Header({
    city,
    country
}: {
    city: string,
    country: string
}) {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                {/* <ActionButton icon="map-marker-outline" border={0} /> */}
                <Text variant="titleSmall" style={styles.leftText}>{`${city}, ${country}`}</Text>
            </View>
            {/* <ActionButton icon="layers-outline" border={1} /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        paddingVertical: 20,
        paddingHorizontal: 20,
        justifyContent: "space-between",
        alignItems: "center",
    },
    left: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: MD3Colors.primary100,
        borderRadius: 50,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: MD3Colors.primary40
    },
    leftText: {
        paddingRight: 15,
        paddingVertical: 5,
    },
});
