import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MD3Colors, Icon, Text } from 'react-native-paper';


export default function SuggestionItem({ isLast = false, text = "Location Name", onPress = () => { } }: { isLast?: boolean, text?: string, onPress?: () => void }) {
    return (
        <React.Fragment>
            <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7} delayPressIn={50}>
                <View style={styles.icon}>
                    <Icon source="map-marker" size={24} color={MD3Colors.primary40} />
                </View>
                <Text style={styles.text}>{text}</Text>
                <View style={styles.icon}>
                    <Icon source="arrow-top-left" size={24} color={MD3Colors.primary40} />
                </View>
            </TouchableOpacity>
            {!isLast && <View style={styles.divider} />}
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    icon: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        padding: 7
    },
    text: {
        flex: 1,
        fontSize: 16,
        textTransform: "capitalize",
    },
    divider: {
        height: 1,
        marginHorizontal: 15,
        backgroundColor: MD3Colors.primary60,
        opacity: 0.3
    }
});
