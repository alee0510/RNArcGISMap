import { NativeEventEmitter, NativeModules } from "react-native";
import LocationModule, { LocationPermission, Coordinates } from "@/native/NativeLocationModule.ts";

async function getCurrentLocation(): Promise<Coordinates | undefined> {
    try {
        const result = await LocationModule.requestLocationPermission();
        if (result === LocationPermission.DENIED) {
            throw Error("Location permission denied")
        }
        const coordinates = await LocationModule.getCurrentLocation();
        if (coordinates?.accuracy) return coordinates;
        throw Error("Failed to get current location")
    } catch (error) {
        console.log("ERROR:", error)
    }
}

export type LocationSubscription = {
    remove: () => void;
}
const locationEmitter = new NativeEventEmitter(NativeModules.LocationModule)
async function startLocationUpdates(intervalInMs: number, onLocationUpdate: (event: Coordinates) => void): Promise<LocationSubscription | undefined> {
    try {
        locationEmitter.addListener('onLocationUpdate', onLocationUpdate);
        await LocationModule.startLocationUpdates(intervalInMs);
        return { remove: () => locationEmitter.removeAllListeners('onLocationUpdate') }
    } catch (error) {
        console.log("ERROR:", error)
    }
}

const LocationService = Object.freeze({ getCurrentLocation, startLocationUpdates })
export default LocationService
