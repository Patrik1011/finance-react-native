import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { AppDispatch, RootState } from '@/redux/store';
import { ActivityIndicator, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { checkAuthState } from '@/redux/authSlice';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const InitialLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const segments: string[] = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkAuthState());
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    // current path includes the auth group
    const inAuthGroup =
      segments.includes('(auth)') ||
      segments.some((segment) => segment === 'login');

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not already on login screen
      router.replace(
        '/(auth)/login' as unknown as Parameters<typeof router.replace>[0],
      );
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated but on login screen
      router.replace('/_app-layout');
    }
  }, [isAuthenticated, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Slot />;
};

const RootLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider mode="light">
          <ThemeProvider value={DefaultTheme}>
            <InitialLayout />
            <StatusBar style="auto" />
          </ThemeProvider>
        </GluestackUIProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default RootLayout;
