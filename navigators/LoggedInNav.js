import React from 'react';
import Feed from '../screens/Feed';
import Search from '../screens/Search';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';
import { Ionicons } from '@expo/vector-icons';
import { Image, View } from 'react-native';
import TabIcon from '../components/auth/nav/TabIcon';
import Me from '../screens/Me';
import SharedStackNav from './SharedStackNav';
import useMe from '../hooks/useMe';
import { createStackNavigator } from '@react-navigation/stack';
import TabsNav from './TabsNav';
import UploadNav from './UploadNav';
import UploadForm from '../screens/UploadForm';
import MessagesNav from './MessagesNav';

const Stack = createStackNavigator();

const LoggedInNav = () => {
  const { data } = useMe();

  return (
    <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen name="Tabs" options={{ headerShown: false }} component={TabsNav} />
      <Stack.Screen
        name="Upload"
        options={{ headerShown: false }}
        component={UploadNav}
      />
      <Stack.Screen
        name="UploadForm"
        options={{
          title: 'Upload',
          headerBackTitleVisible: false,
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: 'black',
          },
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
        }}
        component={UploadForm}
      />
      <Stack.Screen
        name="Messages"
        options={{ headerShown: false }}
        component={MessagesNav}
      />
    </Stack.Navigator>
  );
};

export default LoggedInNav;
