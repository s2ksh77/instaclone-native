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
import client, { isLoggedInVar } from './apollo';
import LoggedInNav from './navigators/LoggedInNav';

export default function App() {
  const [loading, setLoading] = useState();
  const onFinish = () => {
    setLoading(false);
  };
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const preLoad = () => {
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
    const imagesToLoad = [
      require('./assets/icon.png'),
      require('./assets/Instagram-logo.png'),
    ];
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    console.log(fontPromises);
    return Promise.all([...fontPromises, ...imagePromises]);
  };

  if (loading) {
    return <AppLoading startAsync={preLoad} onFinish={onFinish} onError={console.warn} />;
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
      </NavigationContainer>
    </ApolloProvider>
  );
}
