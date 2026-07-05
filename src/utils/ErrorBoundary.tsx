import React from "react";
import { View, Text } from "react-native";
import ErrorBoundary from "react-native-error-boundary";

const CustomFallback = () => {
    return (
        <View>
            <Text>Something went wrong</Text>
        </View>
    )
}

export default function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary FallbackComponent={CustomFallback} onError={(error, stackTrace) => {
            console.error("RNArcGIS Error caught by ErrorBoundary:", error);
            console.error("RNArcGIS Error Stack Trace:", stackTrace);
        }}>
            {children}
        </ErrorBoundary>
    )
}