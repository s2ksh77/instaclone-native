import AppLoading from 'expo-app-loading';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import LoggedOutNav from './navigators/LoggedOutNav';
import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import client, { isLoggedInVar, logUserOut, tokenVar } from './apollo';
import LoggedInNav from './navigators/LoggedInNav';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => {
    setLoading(false);
  };
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const preLoadAssets = () => {
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
    const imagesToLoad = [require('./assets/icon.png'), require('./assets/logo.png')];
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    return Promise.all([...fontPromises, ...imagePromises]);
  };

  const preLoad = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      isLoggedInVar(true);
      tokenVar(token);
    }
    return preLoadAssets();
  };

  if (loading) {
    return <AppLoading startAsync={preLoad} onError={console.warn} onFinish={onFinish} />;
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
      </NavigationContainer>
    </ApolloProvider>
  );
}
