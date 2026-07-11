# react-native-arcgis

A React Native (New Architecture / Fabric + TurboModules) wrapper around the **ArcGIS Maps SDK for Kotlin**, providing a map view component, routing, pin markers, basemap switching, and live user-location tracking.

<p align="center">
  <img src="./screenshots/Screenshot%202026-07-12%20at%2000.16.04.png" width="400" alt="arcgis ui" />
</p>

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Native Modules](#native-modules)
  - [ArcGISMapModule](#arcgismapmodule)
  - [LocationModule](#locationmodule)
- [Native View Component](#native-view-component)
  - [ArcGISMapView](#arcgismapview)
- [React Native Usage](#react-native-usage)
  - [Basic Map](#basic-map)
  - [Basemap Style](#basemap-style)
  - [Pins](#pins)
  - [Routing](#routing)
  - [Zoom Controls](#zoom-controls)
  - [Current Location & Recenter](#current-location--recenter)
  - [Recenter Button Icon State](#recenter-button-icon-state)
- [Design Notes](#design-notes)
- [Setup](#setup)

---

## Architecture Overview

The native side is organized around a single source of truth: **`ArcGISMapController`**, a Kotlin `object` (singleton) that owns all map state — the `ArcGISMap` instance, graphics overlays, viewpoint (lat/long/scale), and the user's last known location. Both the TurboModule (`ArcGISMapModule`) and the Fabric view (`ArcGISMapFabricView`) read from and write to this single controller, so state never has to be synchronized between two owners.

```
┌─────────────────────┐        ┌──────────────────────┐
│   JS / React Native │        │                      │
│                     │──────▶ │  ArcGISMapModule     │  (TurboModule — imperative commands)
│                     │        │  (Promise-based API) │
│                     │        └──────────┬───────────┘
│                     │                   │
│                     │        ┌──────────▼───────────┐
│                     │◀───────│  ArcGISMapController │  (single source of truth)
│                     │ events │  - map / basemap     │
│                     │        │  - overlays (pins,   │
│  <ArcGISMapView />  │        │    route, location)  │
│  (Fabric component) │        │  - viewpoint state   │
│                     │───────▶│  - user location     │
└─────────────────────┘        └──────────┬───────────┘
                                          │
                               ┌──────────▼───────────┐
                               │  ArcGISMapFabricView │  (Compose MapView host)
                               └──────────────────────┘
```

**Key design principle used throughout:** for every piece of state, ask *"can this value change from anything other than JS explicitly setting it?"*

| If the answer is... | Use this pattern |
|---|---|
| **No** — only JS ever sets it (e.g. pins, basemap style) | Reactive prop, or JS-held `useState` |
| **Yes** — native/gestures/other flows can also change it (e.g. zoom scale, camera position) | Imperative TurboModule method that mutates controller state directly |

This avoids "two writers" bugs, where a React re-render silently clobbers a value the user just changed via a gesture or button tap.

---

## Native Modules

### ArcGISMapModule

TurboModule exposing map commands. All methods are Promise-based.

```ts
export enum BasemapStyle {
  ARCGIS_TOPOGRAPHIC = 'ARCGIS_TOPOGRAPHIC',
  ARCGIS_STREETS = 'ARCGIS_STREETS',
  ARCGIS_IMAGERY = 'ARCGIS_IMAGERY',
  ARCGIS_NAVIGATION_NIGHT = 'ARCGIS_NAVIGATION_NIGHT',
}

export interface Spec extends TurboModule {
  setBaseMapStyle(styleName: BasemapStyle): Promise<BasemapStyle>;
  recenterMap(lat: number, lng: number, scale: number): Promise<void>;
  recenterToCurrentLocation(): Promise<void>;
  setUserLocation(latitude: number, longitude: number, recenter: boolean): Promise<void>;
  computeRoute(routeGeoJson: string): Promise<void>;
  clearRoute(): Promise<void>;
  zoomIn(): Promise<void>;
  zoomOut(): Promise<void>;
}
```

| Method | Description |
|---|---|
| `setBaseMapStyle(styleName)` | Swaps the active basemap. Rejects with `INVALID_STYLE` if the name isn't recognized. Resolves with the applied style name. |
| `recenterMap(lat, lng, scale)` | **Absolute** move — pans/zooms the camera to an explicit coordinate + scale, animated. Use when JS already knows the target (e.g. a searched address, a selected pin). |
| `recenterToCurrentLocation()` | **Relative/authoritative** move — recenters on whatever location native already has stored, without JS needing to supply coordinates. Used by a "recenter" button. |
| `setUserLocation(lat, lng, recenter)` | Called by JS whenever a new device location fix is available (see [LocationModule](#locationmodule)). Updates the blue-dot marker; only recenters the camera if `recenter` is `true` **and** it's the first fix received. |
| `zoomIn()` / `zoomOut()` | **Relative** scale change — halves/doubles the current scale from whatever it currently is, clamped to `MIN_SCALE`/`MAX_SCALE`. Does not require JS to track or supply the current zoom value. |
| `computeRoute(routeGeoJson)` | `routeGeoJson` is a serialized array `[startLat, startLong, endLat, endLong]`. Solves a route via `RouteTask`, draws start/end markers + route line, and auto-recenters on the route's start point. Resolves with a JSON string containing `geometry`, `directions`, `totalDistance`, and `totalTime`. |
| `clearRoute()` | Removes all route-tagged graphics (line + start/end markers) from the map. |

**Why `recenterMap` and `recenterToCurrentLocation` are separate methods:** `recenterMap` is a generic "go to this point" primitive that requires JS to supply coordinates. `recenterToCurrentLocation` has no arguments because native is the sole authority on the device's live location — routing this through `recenterMap` would require JS to re-fetch coordinates from `LocationModule` on every tap, duplicating a value native already holds and risking a stale read if the device moved in between.

### LocationModule

TurboModule for location permission handling and position fixes.

```ts
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
```

| Method | Description |
|---|---|
| `checkLocationPermission()` | Returns current permission state without prompting. |
| `requestLocationPermission()` | Prompts the OS permission dialog if not already granted. |
| `getCurrentLocation()` | One-shot location fix. Returns `null` if location services are unavailable even with permission granted. |
| `startLocationUpdates(intervalInMs)` | Starts continuous location updates emitted as `onLocationUpdate` events at the specified interval. |
| `stopLocationUpdates()` | Stops continuous location updates. |
| `addListener(eventName, callback)` | Subscribes to the location event (required signature for TurboModules/NativeEventEmitter). |
| `removeListeners(eventName)` | Unsubscribes from the location event (required signature for TurboModules/NativeEventEmitter). |

> **Note:** This module supports both one-shot queries and a continuous stream of location updates. For continuous location tracking, use `startLocationUpdates(intervalMs)` / `stopLocationUpdates()`, and listen for the `onLocationUpdate` event using `NativeEventEmitter` in React Native.

**Why permission + location orchestration lives in JS, not native-to-native:** `ArcGISMapModule` and `LocationModule` are independent TurboModules. Permission UX (when to prompt, what to do on denial) is a product/UX decision that's easier to control and test from JS, which already has both promises available — so the flow is JS asks permission → JS gets coordinates → JS hands coordinates to `ArcGISMapModule.setUserLocation(...)`.

---

## Native View Component

### ArcGISMapView

Fabric view component hosting a Jetpack Compose `MapView` from the ArcGIS Toolkit.

```ts
interface MapTapEven {
  latitude: Double;
  longitude: Double;
}

interface MapCenterStateEvent {
  isCentered: boolean;
}

export interface NativeProps extends ViewProps {
  pinsJson?: string; // serialized array of {lat, long, id}
  onMapTap?: DirectEventHandler<MapTapEven>;
  onMapCenterStateChange?: DirectEventHandler<MapCenterStateEvent>;
}
```

| Prop / Event | Type | Description |
|---|---|---|
| `pinsJson` | `string` (prop) | Serialized JSON array of pins to render: `[{ id, lat, long }]` (or `[{ lat, long, id }]`). Safe as a reactive prop since JS is the only writer of pin data. |
| `onMapTap` | event | Fires with `{ latitude, longitude }` when the user taps the map. |
| `onMapCenterStateChange` | event | Fires with `{ isCentered: boolean }` whenever the camera crosses the "centered on user" distance threshold (50m) in either direction. Drives the recenter button's icon state. |

> **Deliberately *not* exposed as reactive props:** `latitude`, `longitude`, `zoomScale`. These values can change from many places other than a direct JS prop update — pinch gestures, `zoomIn()`/`zoomOut()`, route auto-recentering, `recenterToCurrentLocation()` — so binding them reactively risks a stray re-render silently resetting the camera to a stale prop value. Set the initial viewpoint imperatively instead:
>
> ```ts
> useEffect(() => {
>   ArcGISMapModule.recenterMap(34.0, -118.0, 72000.0);
> }, []);
> ```

---

## React Native Usage

### Basic Map

```tsx
import ArcGISMapView from './src/native/NativeArcGISMapViewNativeComponent';
import ArcGISMapModule from './src/native/NativeArcGISMapModule';

function MapScreen() {
  useEffect(() => {
    ArcGISMapModule.recenterMap(34.0, -118.0, 72000.0);
  }, []);

  return <ArcGISMapView style={{ flex: 1 }} />;
}
```

### Basemap Style

Safe to hold in JS `useState` — native never changes this value on its own, so there's no risk of desync.

```tsx
import { BasemapStyle } from './src/native/NativeArcGISMapModule';

const [basemapStyle, setBasemapStyle] = useState(BasemapStyle.ARCGIS_TOPOGRAPHIC);

async function handleSelectStyle(style: BasemapStyle) {
  setBasemapStyle(style);
  await ArcGISMapModule.setBaseMapStyle(style);
}
```

### Pins

```tsx
const pins = [
  { id: '1', lat: 34.05, long: -118.25 },
  { id: '2', lat: 34.06, long: -118.24 },
];

<ArcGISMapView pinsJson={JSON.stringify(pins)} />
```

### Routing

```tsx
async function showRoute(start: Coord, end: Coord) {
  const routeGeoJson = JSON.stringify([start.lat, start.lng, end.lat, end.lng]);
  const result = await ArcGISMapModule.computeRoute(routeGeoJson);
  const { directions, totalDistance, totalTime } = JSON.parse(result);
  // route line + start/end markers are drawn natively;
  // camera auto-recenters on the route's start point
}

async function clearRoute() {
  await ArcGISMapModule.clearRoute();
}
```

### Zoom Controls

No JS-side zoom state needed — native owns the current scale.

```tsx
<Button title="+" onPress={() => ArcGISMapModule.zoomIn()} />
<Button title="-" onPress={() => ArcGISMapModule.zoomOut()} />
```

### Current Location & Recenter

```tsx
import { NativeEventEmitter, NativeModules } from 'react-native';
import LocationModule, { LocationPermission } from './src/native/NativeLocationModule';
import ArcGISMapModule from './src/native/NativeArcGISMapModule';

// 1. One-shot user location initialization
useEffect(() => {
  let cancelled = false;

  async function initUserLocation() {
    let permission = await LocationModule.checkLocationPermission();
    if (permission === LocationPermission.DENIED) {
      permission = await LocationModule.requestLocationPermission();
    }
    if (permission === LocationPermission.DENIED || cancelled) return;

    const coords = await LocationModule.getCurrentLocation();
    if (coords && !cancelled) {
      // recenter = true → shows the marker AND zooms/pans to it (first fix only)
      await ArcGISMapModule.setUserLocation(coords.latitude, coords.longitude, true);
    }
  }

  initUserLocation();
  return () => { cancelled = true; };
}, []);

// 2. Continuous location updates (optional, for active location tracking)
useEffect(() => {
  const locationEmitter = new NativeEventEmitter(NativeModules.LocationModule);
  
  const subscription = locationEmitter.addListener('onLocationUpdate', (coords) => {
    // Hand coords to ArcGISMapModule (recenter = false so the camera doesn't steal focus)
    ArcGISMapModule.setUserLocation(coords.latitude, coords.longitude, false);
  });

  // Start updates at an interval of 5000ms
  LocationModule.startLocationUpdates(5000);

  return () => {
    subscription.remove();
    LocationModule.stopLocationUpdates();
  };
}, []);

// Recenter button — no coordinates needed, native already has the last fix
<Button onPress={() => ArcGISMapModule.recenterToCurrentLocation()} />
```

### Recenter Button Icon State

Listen for `onMapCenterStateChange` to know when to swap the recenter button's icon (e.g. filled vs. outlined) based on whether the camera has drifted away from the user's location.

```tsx
const [isCentered, setIsCentered] = useState(true);

<ArcGISMapView
  onMapCenterStateChange={(e) => setIsCentered(e.nativeEvent.isCentered)}
/>

<Button
  onPress={() => ArcGISMapModule.recenterToCurrentLocation()}
  icon={isCentered ? 'location-filled' : 'location-outline'}
/>
```

---

## Design Notes

- **Single controller, single writer per state field.** `ArcGISMapController` separates *camera/viewpoint state* (`latState`, `longState`, `scaleState`) from *device location state* (`currentLocationPoint`). These represent different things — where the map is looking vs. where the user physically is — and only coincide momentarily right after a recenter. Merging them would break the off-center detection logic, which depends on comparing the two.
- **Pending viewpoint queue.** If a viewpoint change is requested before the map view has finished composing (`isMapReady == false`), the request is captured and replayed once the view signals readiness via `onMapReady()`, rather than silently dropped or crashed on an unbound `MapViewProxy`.
- **Spatial reference consistency.** Off-center detection projects the device's WGS84 location into the map's current spatial reference (typically Web Mercator) before computing geodetic distance — `GeometryEngine.distanceGeodeticOrNull` requires matching spatial references and fails silently (returns `null`) otherwise.
- **Graphics draw order matters.** Within a `GraphicsOverlay`, later entries in `graphics` render on top. Route lines are added before start/end markers so markers remain visible on top of the line. Overlay order in the `overlays` list follows the same rule (`pinsOverlay` → `routeOverlay` → `currentPositionOverlay`).

---

## Setup

1. Set your ArcGIS API key in `local.properties` or your CI secrets as `ARCGIS_API_KEY`, consumed via `BuildConfig.ARCGIS_API_KEY` in `MainApplication.kt`.
2. Ensure `ACCESS_FINE_LOCATION` (and `ACCESS_COARSE_LOCATION`) are declared in `AndroidManifest.xml` for `LocationModule` to function.
3. Register both `ArcGISMapModule` and `LocationModule` in your native package (`MyPackage.kt`), and `ArcGISMapViewManager` as a view manager.