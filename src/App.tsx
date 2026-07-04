import { useEffect } from 'react'
import { StatusBar, StyleSheet, View, Text } from 'react-native'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LocationModule, { LocationPermission } from "@/native/NativeLocationModule";

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
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
          <Text>Hello</Text>
      </View>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
      backgroundColor: '#fff',
  },
});

export default App;
