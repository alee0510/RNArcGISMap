import React from "react"
import { View, StyleSheet } from "react-native"
import { ActivityIndicator, MD3Colors } from "react-native-paper"

export default function LoadingScreen() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={40} color={MD3Colors.primary40} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: MD3Colors.primary90,
    },
})
