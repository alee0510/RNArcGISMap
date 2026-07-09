import { Dimensions } from "react-native";
import { BasemapStyle } from "@/native/NativeArcGISMapModule.ts"

export const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export const MIN_SHEET_HEIGHT = Math.abs(SCREEN_HEIGHT / 4)
export const OFFSET_SHEET_TESHOLD = 20

export type Thumbnail = {
    id: string
    name: string
    style: BasemapStyle
    thumbnailUrl: string
}

export type TabBarItem = {
    id: string
    name: string
}

export const TabBarItems: TabBarItem[] = [
    {
        id: "01",
        name: "map",
    },
    {
        id: "02",
        name: "pin",
    },
    {
        id: "03",
        name: "routes",
    },
]

export const MapThumbnails: Thumbnail[] = [
    {
        id: "01",
        name: "Topographic",
        style: BasemapStyle.ARCGIS_TOPOGRAPHIC,
        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/dd247558455c4ffab54566901a14f42c/info/thumbnail/thumbnail1659481851289.png"
    },
    {
        id: "02",
        name: "Imagery",
        style: BasemapStyle.ARCGIS_IMAGERY,
        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/ea3befe305494bb5b2acd77e1b3135dc/info/thumbnail/thumbnail1659480292164.png"
    },
    {
        id: "03",
        name: "Navigation Night",
        style: BasemapStyle.ARCGIS_NAVIGATION_NIGHT,
        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/77073a29526046b89bb5622b6276e933/info/thumbnail/thumbnail1659480999259.png"
    },
    {
        id: "04",
        name: "Streets",
        style: BasemapStyle.ARCGIS_STREETS,
        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/e3e6df1d2f6a485d8a70f28fdd3ce19e/info/thumbnail/thumbnail1626360997976.jpeg"
    },

]

type LandMark = {
    id: string
    name: string
    type: string
    lat: number
    long: number
    distance_meters: number
}

export const LandMarks: LandMark[] = [
    {
        "id": "marker_001",
        "name": "Local Point Alpha",
        "type": "landmark",
        "lat": -7.134521,
        "long": 111.168122,
        "distance_meters": 372
    },
    {
        "id": "marker_002",
        "name": "Intersection Checkpoint",
        "type": "junction",
        "lat": -7.139112,
        "long": 111.162451,
        "distance_meters": 447
    },
    {
        "id": "marker_003",
        "name": "North Field Ridge",
        "type": "nature",
        "lat": -7.131235,
        "long": 111.166110,
        "distance_meters": 574
    },
    {
        "id": "marker_004",
        "name": "Rural Utility Outpost",
        "type": "infrastructure",
        "lat": -7.137890,
        "long": 111.171243,
        "distance_meters": 673
    },
    {
        "id": "marker_005",
        "name": "South Track Entry",
        "type": "pathway",
        "lat": -7.142104,
        "long": 111.164890,
        "distance_meters": 643
    },
    {
        "id": "marker_006",
        "name": "East Community Hub",
        "type": "settlement",
        "lat": -7.135210,
        "long": 111.173115,
        "distance_meters": 866
    },
    {
        "id": "marker_007",
        "name": "West Valley Point",
        "type": "nature",
        "lat": -7.133140,
        "long": 111.158230,
        "distance_meters": 858
    }
]