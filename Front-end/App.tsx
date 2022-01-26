import 'react-native-gesture-handler';
import * as React from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { setNotificationHandler } from 'expo-notifications';

import Navigation from './navigation';
import Loading from './components/UI/Loading';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import store from './store';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

LogBox.ignoreLogs(['Setting a timer for a long period of time']);
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreLogs(['Cannot update a component from inside']);
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  return isLoadingComplete ? (
    <SafeAreaProvider>
      <Provider store={store}>
        <Navigation colorScheme={colorScheme} />
      </Provider>
      <StatusBar />
    </SafeAreaProvider>
  ) : (
    <Loading />
  );
}
