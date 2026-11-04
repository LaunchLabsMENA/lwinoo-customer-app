import { NavigationContainer, DefaultTheme, type Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { navigationRef } from './src/navigation/services';
import { AppNavigator } from './src/navigation/app';
import { COLORS } from './src/assets/colors';

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.brand,
    background: COLORS.surface,
    card: COLORS.surface,
    text: COLORS.ink,
    border: COLORS.hairline,
  },
};

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} theme={navTheme}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
