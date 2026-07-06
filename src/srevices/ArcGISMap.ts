import axios from "axios"
import { ARCGISMAP_KEY, ARCGIS_GEOCODE_SUGGEST_URL, ARCGIS_GEOCODE_FIND_CANDIDATE, ARCGIS_GEOCODE_REVERSE_CODE } from "@env"
import type { Coordinates } from "@/native/NativeLocationModule"
import { Suggestion, Suggestions, Candidate, CandidateItem, Address, AddressLocation } from "@/types/ArcGISAPIResponse"

export async function getSuggestion(searchText: string, location?: Omit<Coordinates, "accuracy">): Promise<Suggestion[]> {
    if (!searchText) return []

    const params = new URLSearchParams({
        f: 'json',
        text: searchText,
        token: ARCGISMAP_KEY,
        maxSuggestions: "5",
    })

    if (location) {
        params.append("location", `${location.longitude},${location.latitude}`)
    }

    try {
        const response = await axios.get<Suggestions>(ARCGIS_GEOCODE_SUGGEST_URL, { params })
        return response.data.suggestions
    } catch (error) {
        console.error("Error in getSuggestion:", error)
        return []
    }
}

export async function findCandidates(suggestion: Suggestion): Promise<CandidateItem | null> {
    if (!suggestion) return null

    const params = new URLSearchParams({
        f: 'json',
        magicKey: suggestion.magicKey,
        singleLine: suggestion.text,
        token: ARCGISMAP_KEY,
        outFields: 'Match_addr,Addr_type'
    })

    try {
        const response = await axios.get<Candidate>(ARCGIS_GEOCODE_FIND_CANDIDATE, { params })
        const best = response.data.candidates[0]
        if (!best) return null
        return best
    } catch (error) {
        console.error("Error in findCandidates:", error)
        return null
    }
}

export async function reverseGeocode(location: Omit<Coordinates, "accuracy">): Promise<AddressLocation | null> {
    if (!location) return null

    const params = new URLSearchParams({
        f: 'json',
        location: `${location.longitude},${location.latitude}`,
        token: ARCGISMAP_KEY
    })

    try {
        const response = await axios.get<Address>(ARCGIS_GEOCODE_REVERSE_CODE, { params })
        return response.data.location
    } catch (error) {
        console.error("Error in reverseGeocode:", error)
        return null
    }
}