// import { useLocationStore } from "@/hooks/useLocation.ts";
import { MD3Colors } from 'react-native-paper';
import { Dimensions, StyleSheet, View } from 'react-native';
import IconButton from "@/components/ui/IconButton.tsx";
import ButtonNavBar from "@/components/BottonNavBar.tsx";
// import Header from "@/components/Header.tsx";
import Map from "@/components/feature/Map.tsx";
import ReCenterButton from '@/components/feature/ReCenterButton.tsx';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
    // const { address } = useLocationStore()
    return (
        <View style={styles.container}>
            <Map />
            {/* <Header city={address.City} country={address.CntryName} /> */}
            <ButtonNavBar />
            <ReCenterButton />
            <View style={styles.zoomaction}>
                <IconButton icon="plus" border={1} />
                <IconButton icon="minus" border={1} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MD3Colors.primary90
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
