import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export enum LocationPermission {
  FINE = 'fine',
  COARSE = 'coarse',
  DENIED = 'denied',
}

export interface Spec extends TurboModule {
  checkLocationPermission(): Promise<LocationPermission>;
  requestLocationPermission(): Promise<LocationPermission>;
  getCurrentLocation(): Promise<Location | null>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('LocationModule');
