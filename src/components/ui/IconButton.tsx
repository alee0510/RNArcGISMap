import { StyleSheet, View, ViewStyle } from "react-native"
import { Icon, MD3Colors } from "react-native-paper"

interface IconButtonProps {
    icon: string,
    iconSize?: number,
    space?: number,
    activeIconColor?: string,
    inactiveIconColor?: string,
    activeBackgroundColor?: string,
    inactiveBackgroundColor?: string,
    borderColor?: string,
    border?: number,
    active?: boolean,
    style?: ViewStyle
}

export default function IconButton({
    icon,
    iconSize = 24,
    space = 10,
    activeIconColor = MD3Colors.primary40,
    inactiveIconColor = MD3Colors.secondary70,
    activeBackgroundColor = MD3Colors.primary100,
    inactiveBackgroundColor = MD3Colors.primary100,
    borderColor = MD3Colors.primary40,
    border = 0,
    active = false,
    style
}: IconButtonProps) {
    return (
        <View style={[
            styles.container,
            {
                backgroundColor: active ? activeBackgroundColor : inactiveBackgroundColor,
                borderColor: borderColor,
                borderWidth: border,
                padding: space,
            },
            style
        ]}>
            <Icon source={icon} size={iconSize} color={active ? activeIconColor : inactiveIconColor} />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 50
    }
});
