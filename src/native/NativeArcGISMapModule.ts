import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';

export enum BasemapStyle {
    ARCGIS_TOPOGRAPHIC = 'ARCGIS_TOPOGRAPHIC',
    ARCGIS_STREETS = 'ARCGIS_STREETS',
    ARCGIS_IMAGERY = 'ARCGIS_IMAGERY',
    ARCGIS_NAVIGATION_NIGHT = 'ARCGIS_NAVIGATION_NIGHT',
}

export type RouteTaskParams = {
    stops: {lat: number, lng: number}[]
}

export interface Spec extends TurboModule {
    setBaseMapStyle(styleName: BasemapStyle): Promise<BasemapStyle>
    computeRoute(params: RouteTaskParams): Promise<void>
    clearRoute(): Promise<void>
}

export default TurboModuleRegistry.getEnforcing<Spec>('ArcGISMapModule');