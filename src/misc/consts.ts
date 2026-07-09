import { Dimensions } from "react-native";
import { BasemapStyle } from "@/native/NativeArcGISMapModule.ts"

export const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type Thumbnail = {
    id: string
    name: string
    style: BasemapStyle
    thumbnailUrl: string
}
export const MapThumbnails: Thumbnail[] = [
    {
        id: "01",
        name: "ArcGIS Topographic",
        style: BasemapStyle.ARCGIS_TOPOGRAPHIC,
        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/dd247558455c4ffab54566901a14f42c/info/thumbnail/thumbnail1659481851289.png"
    },
    {
        id: "02",
        name: "ArcGIS Imagery",
        style: BasemapStyle.ARCGIS_IMAGERY,
        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/ea3befe305494bb5b2acd77e1b3135dc/info/thumbnail/thumbnail1659480292164.png"
    },
    {
        id: "03",
        name: "ArcGIS Navigation Night",
        style: BasemapStyle.ARCGIS_NAVIGATION_NIGHT,
        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/77073a29526046b89bb5622b6276e933/info/thumbnail/thumbnail1659480999259.png"
    },
    {
        id: "04",
        name: "ArcGIS Streets",
        style: BasemapStyle.ARCGIS_STREETS,
        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/e3e6df1d2f6a485d8a70f28fdd3ce19e/info/thumbnail/thumbnail1626360997976.jpeg"
    },

]