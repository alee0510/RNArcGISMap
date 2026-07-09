import { useEffect, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Icon, MD3Colors } from "react-native-paper"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

import { SCREEN_HEIGHT, TabBarItems } from "@/misc/consts.ts"

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const Icons: Record<string, (props: any) => React.ReactElement> = {
    map: (props: any) => <Icon source="map" size={24} {...props} />,
    pin: (props: any) => <Icon source="pin" size={24} {...props} />,
    routes: (props: any) => <Icon source="routes" size={24} {...props} />,
}

function TabItem({ active, icon, onPress }: { active: boolean, icon: string, onPress: () => void }) {
    const scale = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.3])
        return {
            transform: [{ scale: scaleValue }]
        }
    })

    useEffect(() => {
        scale.value = withSpring(active ? 1 : 0, { duration: 250 })
    }, [active, scale])

    return (
        <Pressable onPress={onPress} style={styles.tabBarItem}>
            <Animated.View style={animatedStyle}>
                {Icons[icon]({
                    color: active ? MD3Colors.primary40 : MD3Colors.secondary80,
                })}
            </Animated.View>
        </Pressable>
    )
}

export default function BottomNavBar() {
    const [active, setActive] = useState("01")
    const tabPositionX = useSharedValue(0)

    const onTabPress = (id: string, index: number) => {
        setActive(id)
        tabPositionX.value = withSpring(50 * index, { duration: 350 })
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionX.value }]
        }
    })

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.tabPosition,
                animatedStyle,
            ]} />
            {TabBarItems.map((tabBar, index) => {
                return <TabItem
                    key={tabBar.id}
                    icon={tabBar.name}
                    active={active === tabBar.id}
                    onPress={() => onTabPress(tabBar.id, index)}
                />
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        backgroundColor: MD3Colors.primary40,
        borderRadius: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        padding: 10,
        bottom: SCREEN_HEIGHT * 0.05,
    },
    tabPosition: {
        position: 'absolute',
        backgroundColor: MD3Colors.secondary99,
        borderRadius: 50,
        marginHorizontal: 10,
        height: 50,
        width: 50
    },
    tabBarItem: {
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: "center",
    },
});
