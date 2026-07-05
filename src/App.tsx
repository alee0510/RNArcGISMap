import { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LocationModule, { LocationPermission } from "@/native/NativeLocationModule";
import ArcGISMapView from "@/native/NativeArcGISMapViewNativeComponent";
import ErrorBoundaryWrapper from '@/utils/ErrorBoundary';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const init = async () => {
    const permission = await LocationModule.checkLocationPermission()
    if (permission === LocationPermission.DENIED) {
      const result = await LocationModule.requestLocationPermission()
      if (result === LocationPermission.DENIED) {
        console.log("ERROR: permission denied!")
        return
      }
    }
    const location = await LocationModule.getCurrentLocation()
    console.log("INFO: location", location)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <ErrorBoundaryWrapper>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.container}>
          <ArcGISMapView
            style={styles.map}
            latitude={34.05}
            longitude={-118.25}
            zoomScale={100000.0}
            pinsJson={JSON.stringify([
              { lat: 34.05, long: -118.25, id: 'pin1' },
              { lat: 34.03, long: -118.26, id: 'pin2' },
              { lat: 34.04, long: -118.27, id: 'pin3' },
              { lat: 34.05, long: -118.28, id: 'pin4' },
              { lat: 34.06, long: -118.29, id: 'pin5' },
            ])}
            onMapTap={(e) => console.log(e.nativeEvent.latitude, e.nativeEvent.longitude)}
          />
        </View>
      </SafeAreaProvider>
    </ErrorBoundaryWrapper>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default App;
