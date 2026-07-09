/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useMapLocation } from '@/hooks/useMapLocation.ts';
import ErrorBoundaryWrapper from '@/utils/ErrorBoundary.tsx';
import LocationService from "@/srevices/LocationService.ts"

import LoadingScreen from '@/screens/LoadingScreen.tsx';
import HomeScreen from '@/screens/HomeScreen.tsx';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { setLocation, isLoading } = useMapLocation();

  const init = async () => {
    const result = await LocationService.getCurrentLocation()
    if (result) {
      setLocation({ latitude: result.latitude, longitude: result.longitude })
    }
  }

  // side-effect
  useEffect(() => {
    init()
  }, [])

  return (
    <ErrorBoundaryWrapper>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          {isLoading ? <LoadingScreen /> : <HomeScreen />}
        </SafeAreaProvider>
      </GestureHandlerRootView>

    </ErrorBoundaryWrapper>
  );
}

export default App;
