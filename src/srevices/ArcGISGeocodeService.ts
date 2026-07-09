import axios from "axios"
import { env } from "@/env.ts"
import { Coordinates } from "@/native/NativeLocationModule.ts"
import {
    Address,
    AddressAttributes,
    Candidate,
    CandidateItem,
    Suggestion,
    Suggestions,
} from "@/types/ArcGISAPIResponse.ts"

type Location = Omit<Coordinates, "accuracy">;

export async function getSuggestion(searchText: string, location?: Location): Promise<Suggestion[]> {
    if (!searchText || !location) return []
    try {
        const response = await axios.get<Suggestions>(env.ARCGIS_GEOCODE_SUGGEST_URL, {
            params: {
                f: 'json',
                text: searchText,
                token: env.ARCGISMAP_KEY,
                location: `${location.longitude},${location.latitude}`,
                maxSuggestions: "5",
            }
        })
        return response.data.suggestions
    } catch (error) {
        console.error("Error in getSuggestion:", error)
        return []
    }
}

export async function findCandidates(suggestion: Suggestion): Promise<CandidateItem | null> {
    if (!suggestion) return null
    try {
        const response = await axios.get<Candidate>(env.ARCGIS_GEOCODE_FIND_CANDIDATE, {
            params: {
                f: 'json',
                magicKey: suggestion.magicKey,
                singleLine: suggestion.text,
                token: env.ARCGISMAP_KEY,
                outFields: 'Match_addr,Addr_type'
            }
        })
        const best = response.data.candidates[0]
        if (!best) return null
        return best
    } catch (error) {
        console.error("Error in findCandidates:", error)
        return null
    }
}

export async function reverseGeocode(location: Location): Promise<AddressAttributes | null> {
    if (!location) return null
    try {
        const response = await axios.get<Address>(env.ARCGIS_GEOCODE_REVERSE_CODE, {
            params: {
                f: 'json',
                location: `${location.longitude},${location.latitude}`,
                token: env.ARCGISMAP_KEY
            }
        })
        return response.data.address
    } catch (error: any) {
        console.error("Error in reverseGeocode:", error?.response?.status, JSON.stringify(error?.response?.data))
        return null
    }
}