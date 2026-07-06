import { StyleSheet, View } from 'react-native';
import { Text, MD3Colors } from 'react-native-paper';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={{ color: MD3Colors.error50 }}>Home</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MD3Colors.primary90
    }
});
