import { StatusBar } from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocationStore } from '@/hooks/useLocation';
import ErrorBoundaryWrapper from '@/utils/ErrorBoundary';
import LocationService from "@/srevices/Location"

import LoadingScreen from '@/screens/LoadingScreen';
import { useEffect } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { setLocation } = useLocationStore();

  const init = async () => {
    const result = await LocationService.getCurrentLocation()
    if (result) {
      setLocation({ latitude: result.latitude, longitude: result.longitude })
    }
  }

  // side-effect
  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ErrorBoundaryWrapper>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <LoadingScreen />
      </SafeAreaProvider>
    </ErrorBoundaryWrapper>
  );
}

export default App;
