import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MD3Colors, Icon } from 'react-native-paper';
import Animated, { FadeIn, FadeInUp, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useDebounce } from 'use-debounce';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/misc/consts.ts';
import SuggestionItem from '@/components/feature/SuggestionItem.tsx';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
export default function Header() {
    const [focused, setFocused] = useState(false)
    const [query, setQuery] = useState("")
    const [debouncedQuery] = useDebounce(query, 1000)
    const inputRef = useRef<TextInput>(null)
    const iconOpacity = useSharedValue(0)

    const onSearch = () => {
        setFocused(true)
    }

    const onCancel = () => {
        setFocused(false)
        inputRef.current?.blur()
    }

    const markerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(iconOpacity.value === 0 ? 1 : 0),
            transform: [{ scale: withTiming(iconOpacity.value === 0 ? 1 : 0) }],
            position: "absolute"
        }
    })

    const backIconAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(iconOpacity.value === 0 ? 0 : 1),
            transform: [{ scale: withTiming(iconOpacity.value === 0 ? 0 : 1) }]
        }
    })

    const iconAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(iconOpacity.value === 0 ? MD3Colors.primary100 : MD3Colors.primary40)
        }
    })

    useEffect(() => {
        iconOpacity.value = focused ? 1 : 0
    }, [focused, iconOpacity])

    console.log("INFO: text", debouncedQuery)
    return (
        <React.Fragment>
            <View style={styles.container}>
                <Animated.View style={[styles.icon, iconAnimatedStyle]}>
                    <Animated.View style={markerAnimatedStyle}>
                        <Icon source="map-marker" size={24} color={MD3Colors.primary40} />
                    </Animated.View>
                    <AnimatedPressable onPress={onCancel} style={backIconAnimatedStyle}>
                        <Icon source="arrow-left-thin" size={24} color={MD3Colors.primary100} />
                    </AnimatedPressable>
                </Animated.View>
                <View style={styles.inputContainer}>
                    <TextInput
                        ref={inputRef}
                        defaultValue='Street, City, Country'
                        onChangeText={(text) => setQuery(text)}
                        style={styles.input}
                    />
                    {!focused && <Pressable onPress={onSearch} style={StyleSheet.absoluteFill} pointerEvents='auto' />}
                </View>
            </View>
            {focused && (
                <React.Fragment>
                    <AnimatedPressable entering={FadeIn} exiting={FadeOut} onPress={onCancel} style={styles.backdrop} />
                    <Animated.View layout={LinearTransition.duration(250)} entering={FadeInUp} exiting={FadeOut} style={styles.suggestion}>
                        <SuggestionItem />
                        <SuggestionItem />
                        <SuggestionItem isLast={true} />
                    </Animated.View>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        backgroundColor: MD3Colors.primary100,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 20,
        marginHorizontal: 20,
        borderRadius: 50,
        zIndex: 5,
    },
    icon: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        padding: 7
    },
    inputContainer: {
        flex: 1,
    },
    input: {
        fontSize: 16
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        zIndex: 4,
        backgroundColor: "rgba(0,0,0,0.3)"
    },
    suggestion: {
        backgroundColor: MD3Colors.primary100,
        zIndex: 5,
        borderRadius: 25,
        position: "absolute",
        alignSelf: "center",
        gap: 5,
        top: SCREEN_HEIGHT * 0.11,
        padding: 15,
        width: SCREEN_WIDTH - 40
    },
});
