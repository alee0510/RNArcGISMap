import { useEffect } from "react";
import { StyleSheet, Pressable } from "react-native"
import { Icon, MD3Colors } from "react-native-paper"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import ArGISMapModule from "@/native/NativeArcGISMapModule.ts"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
export default function ReCenterButton({ isCentered }: { isCentered: boolean }) {
    const progress = useSharedValue(1)

    // 0 = not-centered, 1 = centered
    const toggle = async () => {
        if (isCentered) return
        progress.value = withTiming(1)
        await ArGISMapModule.recenterToCurrentLocation()
    }

    const crosshairsAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(progress.value === 0 ? 1 : 0),
            transform: [{ scale: withTiming(progress.value === 0 ? 1 : 0) }],
            position: 'absolute',
        }
    })

    useEffect(() => {
        if (isCentered) return
        progress.value = withTiming(0)
    }, [isCentered, progress])

    const crosshairsGpsAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(progress.value === 1 ? 1 : 0),
            transform: [{ scale: withTiming(progress.value === 1 ? 1 : 0) }],
        }
    })

    const containerAnimated = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(progress.value === 0 ? MD3Colors.primary100 : MD3Colors.primary40),
        }
    })

    return (
        <AnimatedPressable style={[styles.container, containerAnimated]} onPress={() => {
            if (!isCentered) toggle()
        }}>
            <Animated.View style={crosshairsAnimatedStyle}>
                <Icon source="crosshairs" size={24} color={MD3Colors.primary40} />
            </Animated.View>
            <Animated.View style={crosshairsGpsAnimatedStyle}>
                <Icon source="crosshairs-gps" size={24} color={MD3Colors.primary100} />
            </Animated.View>
        </AnimatedPressable>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        borderColor: MD3Colors.primary40,
        borderWidth: 1,
        padding: 10,
        position: "absolute",
        bottom: 150,
        right: 20,
        justifyContent: "center",
        alignItems: "center",
    }
});
