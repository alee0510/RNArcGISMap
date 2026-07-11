import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MD3Colors, Icon, Text } from 'react-native-paper';
import Animated, { FadeIn, FadeInUp, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useDebounce } from 'use-debounce';

import SuggestionItem from '@/components/feature/SuggestionItem.tsx';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/misc/consts.ts';
import { getSuggestion } from "@/srevices/ArcGISGeocodeService.ts"
import { Suggestion } from "@/types/ArcGISAPIResponse.ts"
import { useMapLocation } from '@/hooks/useMapLocation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
export default function Header() {
    const [focused, setFocused] = useState(false)
    const [query, setQuery] = useState("")
    const [items, setItems] = useState<Suggestion[]>([])
    const { location, address } = useMapLocation()
    const [debouncedQuery] = useDebounce(query, 1000)
    const inputRef = useRef<TextInput>(null)
    const iconOpacity = useSharedValue(0)

    const onSearch = () => {
        setFocused(true)
    }

    const onCancel = () => {
        setFocused(false)
        setQuery(`${address.City}, ${address.CountryCode}`)
        setItems([])
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

    const fetchSuggestion = async () => {
        const result = await getSuggestion(debouncedQuery, location)
        setItems(result)
    }

    useEffect(() => {
        iconOpacity.value = focused ? 1 : 0
    }, [focused, iconOpacity])

    useEffect(() => {
        if (debouncedQuery.length < 5) return
        fetchSuggestion()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery])

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
                        defaultValue={`${address.City}, ${address.CountryCode}`}
                        value={query}
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
                        {items.length ? items.map((item, index) => (
                            <SuggestionItem key={item.magicKey} text={item.text} isLast={index === items.length - 1} />
                        )) : (
                            <View style={styles.defaultTextContainer}>
                                <Text style={styles.defaultText}>No result found.</Text>
                            </View>
                        )}
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
    defaultTextContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 50,
    },
    defaultText: {
        fontSize: 18,
        fontStyle: "italic",
        textTransform: "capitalize",
    }
});
