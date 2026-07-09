/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MD3Colors } from 'react-native-paper';
import Animated, { FadeIn, FadeOut, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-worklets';

import IconButton from '@/components/ui/IconButton.tsx';
import { MIN_SHEET_HEIGHT, OFFSET_SHEET_TESHOLD, MapThumbnails, SCREEN_HEIGHT } from "@/misc/consts.ts"
import ArcGISMapModule, { BasemapStyle } from "@/native/NativeArcGISMapModule.ts"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
function MapThumbnailView({ uri, label, isSelected, onPress }: { uri: string, label: string, isSelected: boolean, onPress: () => void }) {
    const progress = useSharedValue(isSelected ? 1 : 0)
    const animatedImageStyle = useAnimatedStyle(() => {
        return {
            borderWidth: interpolate(progress.value, [0, 1], [0, 3])
        }
    })

    useEffect(() => {
        progress.value = withTiming(isSelected ? 1 : 0, { duration: 200 })
    }, [isSelected, progress])

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0, 1], [0.6, 1]),
            transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.1]) }]
        }
    })

    return (
        <Pressable onPress={onPress} style={styles.mapTypeContainer}>
            <Animated.Image source={{ uri: uri }} style={[
                styles.mapThumbnail,
                animatedImageStyle
            ]} />
            <Animated.Text style={[
                styles.mapTypeText,
                animatedTextStyle,
                {
                    fontWeight: isSelected ? "700" : "500"
                }
            ]}>{label}</Animated.Text>
        </Pressable>
    )
}

export default function BottomSheet() {
    const [visible, setVisible] = useState(false)
    const [selectedId, setSelectedId] = useState("01")
    const offset = useSharedValue(0)

    const onOpen = () => {
        setVisible(true)
        offset.value = 0
    }
    const onClose = () => setVisible(false)
    const onSelect = async (id: string, style: BasemapStyle) => {
        await ArcGISMapModule.setBaseMapStyle(style)
        setSelectedId(id)
    }

    const pan = usePanGesture({
        onUpdate: e => {
            const offsetDelta = offset.value + e.changeY;
            const clamp = Math.max(-OFFSET_SHEET_TESHOLD, offsetDelta);
            offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
        },
        onFinalize: _ => {
            if (offset.value < MIN_SHEET_HEIGHT / 3) {
                offset.value = withSpring(0);
            } else {
                offset.value = withTiming(MIN_SHEET_HEIGHT, { duration: 200 }, () => {
                    runOnJS(onClose)();
                });
            }
        },
    })

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: offset.value }]
        }
    })

    return (
        <React.Fragment>
            <IconButton border={1} icon='layers' onPress={onOpen} style={styles.mapStyleButton} />
            {visible && (
                <React.Fragment>
                    <AnimatedPressable entering={FadeIn} exiting={FadeOut} onPress={onClose} style={styles.backdrop} />
                    <GestureDetector gesture={pan}>
                        <Animated.View style={[styles.container, animatedStyle]}>
                            <View style={styles.handler} />
                            <Text style={styles.title}>Map Type</Text>
                            <View style={styles.body}>
                                {MapThumbnails.map(thumbnail => (
                                    <MapThumbnailView
                                        key={thumbnail.id}
                                        label={thumbnail.name}
                                        uri={thumbnail.thumbnailUrl}
                                        isSelected={thumbnail.id === selectedId}
                                        onPress={() => onSelect(thumbnail.id, thumbnail.style)}
                                    />
                                ))}
                            </View>
                        </Animated.View>
                    </GestureDetector>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.3)"
    },
    container: {
        position: "absolute",
        right: 0,
        left: 0,
        bottom: -OFFSET_SHEET_TESHOLD * 1.1,
        height: MIN_SHEET_HEIGHT,
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        zIndex: 1,
    },
    handler: {
        height: 4,
        width: 60,
        backgroundColor: MD3Colors.secondary90,
        borderRadius: 2,
        alignSelf: "center",
    },
    body: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    title: {
        fontSize: 24,
        marginVertical: 16,
        fontWeight: "700",
        color: MD3Colors.primary60,
    },
    mapStyleButton: {
        position: "absolute",
        top: SCREEN_HEIGHT * 0.1,
        right: 20
    },
    mapTypeContainer: {
        alignItems: "center",
        gap: 6
    },
    mapTypeText: {
        fontSize: 13,
        color: MD3Colors.primary60,
    },
    mapThumbnail: {
        height: 75,
        width: 75,
        borderRadius: 8,
        overflow: "hidden",
        borderColor: MD3Colors.primary60
    },
})