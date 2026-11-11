import { NavigationContainer, DefaultTheme, type Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { navigationRef } from './src/navigation/services';
import { AppNavigator } from './src/navigation/app';
import { COLORS } from './src/assets/colors';
import { I18nProvider } from './src/i18n';
import { SessionWatcher } from './src/navigation/session-watcher';
import { AuthGateProvider } from './src/components/auth-gate';

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
    <I18nProvider>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef} theme={navTheme}>
          <AuthGateProvider>
            <SessionWatcher />
            <AppNavigator />
          </AuthGateProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </I18nProvider>
  );
}

export default App;
