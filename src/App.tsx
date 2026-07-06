import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocationStore } from '@/hooks/useLocation';
import ErrorBoundaryWrapper from '@/utils/ErrorBoundary';
import LocationService from "@/srevices/Location"

import LoadingScreen from '@/screens/LoadingScreen.tsx';
import HomeScreen from '@/screens/HomeScreen.tsx';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { setLocation, isLoading } = useLocationStore();

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
        {isLoading ? <LoadingScreen /> : <HomeScreen />}
      </SafeAreaProvider>
    </ErrorBoundaryWrapper>
  );
}

export default App;
