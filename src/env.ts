import { ARCGISMAP_KEY, ARCGIS_GEOCODE_SUGGEST_URL, ARCGIS_GEOCODE_FIND_CANDIDATE, ARCGIS_GEOCODE_REVERSE_CODE } from '@env'
import * as Z from 'zod'

const envSchema = Z.object({
    ARCGISMAP_KEY: Z.string(),
    ARCGIS_GEOCODE_SUGGEST_URL: Z.string(),
    ARCGIS_GEOCODE_FIND_CANDIDATE: Z.string(),
    ARCGIS_GEOCODE_REVERSE_CODE: Z.string(),
})

export const env = envSchema.parse({
    ARCGISMAP_KEY,
    ARCGIS_GEOCODE_SUGGEST_URL,
    ARCGIS_GEOCODE_FIND_CANDIDATE,
    ARCGIS_GEOCODE_REVERSE_CODE,
})

export type Env = Z.infer<typeof envSchema>