import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';

export interface Coordinates {
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
  getCurrentLocation(): Promise<Coordinates | null>;
  startLocationUpdates(intervalInMs: number): Promise<void>;
  stopLocationUpdates(): Promise<void>;
  addListener(eventName: string, callback: (event: Coordinates) => void): void;
  removeListeners(eventName: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('LocationModule');
