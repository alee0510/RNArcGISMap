import { Pressable, StyleSheet, ViewStyle } from "react-native"
import { Icon, MD3Colors } from "react-native-paper"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

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
    onPress?: () => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
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
    style,
    onPress
}: IconButtonProps) {
    const scale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        }
    })

    const handlePressIn = () => {
        scale.value = withSpring(0.7, { damping: 10, stiffness: 150 })
    }

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 7, stiffness: 180 })
    }

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={[
                animatedStyle,
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
        </AnimatedPressable >
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 50
    }
});
