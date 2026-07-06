import { StatusBar } from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundaryWrapper from '@/utils/ErrorBoundary';

import LoadingScreen from '@/screens/LoadingScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
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
