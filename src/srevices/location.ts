import LocationModule, { LocationPermission, Coordinates } from "@/native/NativeLocationModule";

export async function requestLocationPermission(): Promise<Coordinates | undefined> {
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