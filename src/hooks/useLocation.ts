import { create } from "zustand";
import { Coordinates } from "@/native/NativeLocationModule.ts"
import { reverseGeocode } from "@/srevices/ArcGISMap.ts"

type Location = Omit<Coordinates, "accuracy">

type Address = {
    City: string;
    CntryName: string;
    CountryCode: string;
}

export interface LocationState {
    location: Location;
    address: Address;
    isLoading: boolean;
    setLocation: (location: Location | null) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
    location: {
        latitude: 0,
        longitude: 0
    },
    address: {
        City: "",
        CntryName: "",
        CountryCode: "",
    },
    isLoading: true,
    setLocation: async (location) => {
        if (!location) return
        const result = await reverseGeocode(location)
        if (!result) return
        set({ location: location, address: result, isLoading: false })
    },
}))