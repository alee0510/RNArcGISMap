import { create } from "zustand";
import { Coordinates } from "@/native/NativeLocationModule.ts"
import { reverseGeocode } from "@/srevices/ArcGISGeocodeService.ts"

type Location = Omit<Coordinates, "accuracy">

type Address = {
    City: string;
    CntryName: string;
    CountryCode: string;
}

export interface MapLocationState {
    location: Location;
    address: Address;
    zoom: number;
    isLoading: boolean;
    setLocation: (location: Location | null) => Promise<void>;
    increaseZoom: (zoom: number) => void;
    decreaseZoom: (zoom: number) => void;
}

export const useMapLocation = create<MapLocationState>((set) => ({
    location: {
        latitude: 0,
        longitude: 0
    },
    address: {
        City: "",
        CntryName: "",
        CountryCode: "",
    },
    zoom: 70000.0,
    isLoading: true,
    setLocation: async (location) => {
        if (!location) return
        const result = await reverseGeocode(location)
        if (!result) return
        set({ location: location, address: result, isLoading: false })
    },
    increaseZoom: (zoom) => set((state) => ({ zoom: state.zoom + zoom })),
    decreaseZoom: (zoom) => set((state) => ({ zoom: state.zoom - zoom })),
}))