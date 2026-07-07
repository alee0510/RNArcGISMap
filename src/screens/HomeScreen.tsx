import { useLocationStore } from "@/hooks/useLocation.ts";
import { MD3Colors } from 'react-native-paper';
import { Dimensions, StyleSheet, View } from 'react-native';
import ActionButton from "@/components/ActionButton.tsx";
import ButtonNavBar from "@/components/BottonNavBar.tsx";
import Header from "@/components/Header.tsx";
import Map from "@/components/Map.tsx";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
    const { address } = useLocationStore()
    return (
        <View style={styles.container}>
            <Map />
            <Header city={address.City} country={address.CntryName} />
            <ButtonNavBar />
            <ActionButton icon="crosshairs" border={1} style={styles.recenter} />
            <View style={styles.zoomaction}>
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
    recenter: {
        position: "absolute",
        bottom: 150,
        right: 20,
    },
    zoomaction: {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        gap: 10,
        bottom: SCREEN_HEIGHT / 2,
        right: 20,
    }
});
