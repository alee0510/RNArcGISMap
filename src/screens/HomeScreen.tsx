import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, Icon, MD3Colors } from 'react-native-paper';
import { useLocationStore } from "@/hooks/useLocation.ts"
import Map from "@/components/Map.tsx"

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export default function HomeScreen() {
    const { address } = useLocationStore()
    return (
        <View style={styles.container}>
            <Map />
            <View style={styles.header}>
                <View style={styles.location}>
                    <View style={styles.locationIcon}>
                        <Icon source="map-marker-outline" size={24} color={MD3Colors.secondary70} />
                    </View>
                    <Text variant="titleMedium" style={styles.locationText}>{`${address.City}, ${address.CntryName}`}</Text>
                </View>
                <View style={[styles.actionIcon, styles.actionIconWithBorder]}>
                    <Icon source="layers-outline" size={24} color={MD3Colors.secondary70} />
                </View>
            </View>
            <View style={styles.bottomNavBar}>
                <View style={[styles.bottomNavBarIcon, styles.bottomNavBarIconActive]}>
                    <Icon source="map" size={24} color={MD3Colors.primary40} />
                </View>
                <View style={styles.bottomNavBarIcon}>
                    <Icon source="pin" size={24} color={MD3Colors.primary80} />
                </View>
                <View style={styles.bottomNavBarIcon}>
                    <Icon source="routes" size={24} color={MD3Colors.primary80} />
                </View>
            </View>
            <View style={[styles.actionIcon, styles.actionIconWithBorder, styles.recenter]}>
                <Icon source="crosshairs" size={24} color={MD3Colors.secondary70} />
            </View>
            <View style={styles.zoomAction}>
                <View style={[styles.actionIcon, styles.actionIconWithBorder]}>
                    <Icon source="plus" size={24} color={MD3Colors.secondary70} />
                </View>
                <View style={[styles.actionIcon, styles.actionIconWithBorder]}>
                    <Icon source="minus" size={24} color={MD3Colors.secondary70} />
                </View>
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
    location: {
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
    actionIcon: {
        backgroundColor: MD3Colors.primary100,
        padding: 10,
        borderRadius: 50,
    },
    actionIconWithBorder: {
        borderWidth: 1,
        borderColor: MD3Colors.primary40
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
    },
    bottomNavBar: {
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
    bottomNavBarIcon: {
        borderRadius: 50,
        padding: 15
    },
    bottomNavBarIconActive: {
        backgroundColor: MD3Colors.primary80,
        borderRadius: 50,
    }
});
