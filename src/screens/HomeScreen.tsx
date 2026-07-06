import { useLocationStore } from "@/hooks/useLocation.ts";
import { Text, Icon, MD3Colors } from 'react-native-paper';
import { Dimensions, StyleSheet, View } from 'react-native';
import ActionButton from "@/components/ActionButton.tsx";
import ButtonNavBar from "@/components/BottonNavBar.tsx";
import Map from "@/components/Map.tsx";


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export default function HomeScreen() {
    const { address } = useLocationStore()
    return (
        <View style={styles.container}>
            <Map />
            <View style={styles.header}>
                <View style={styles.locationContainer}>
                    <View style={styles.locationIcon}>
                        <Icon source="map-marker-outline" size={24} color={MD3Colors.secondary70} />
                    </View>
                    <Text variant="titleMedium" style={styles.locationText}>{`${address.City}, ${address.CntryName}`}</Text>
                </View>
                <ActionButton icon="layers-outline" border={1} />
            </View>
            <ButtonNavBar />
            <ActionButton icon="crosshairs" border={1} style={styles.recenter} />
            <View style={styles.zoomAction}>
                <ActionButton icon="plus" border={1} />
                <ActionButton icon="minus" border={1} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MD3Colors.primary90
    },
    header: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        paddingVertical: 20,
        paddingHorizontal: 20,
        justifyContent: "space-between",
        alignItems: "center",
    },
    locationContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: MD3Colors.primary100,
        borderRadius: 50,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: MD3Colors.primary40
    },
    locationIcon: {
        padding: 10,
    },
    locationText: {
        paddingRight: 15,
        paddingVertical: 5,
    },
    recenter: {
        position: "absolute",
        bottom: 150,
        right: 20,
    },
    zoomAction: {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        gap: 10,
        bottom: SCREEN_HEIGHT / 2,
        right: 20,
    }
});
