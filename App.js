import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';
import { Asset } from 'expo-asset';

export default function App() {
  const [loading, setLoading] = useState();
  const onFinish = () => {
    setLoading(false);
  };
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
    <View style={styles.container}>
      <Text>Done</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
