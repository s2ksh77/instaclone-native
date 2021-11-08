import React from "react";
import Feed from "../screens/Feed";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Profile";
import { Ionicons } from "@expo/vector-icons";
import { Image, View } from "react-native";
import TabIcon from "../components/auth/nav/TabIcon";
import Me from "../screens/Me";
import SharedStackNav from "./SharedStackNav";
import useMe from "../hooks/useMe";
import { createStackNavigator } from "@react-navigation/stack";
import TabsNav from "./TabsNav";
import Upload from "../screens/Upload";

const Stack = createStackNavigator();

const LoggedInNav = () => {
  const { data } = useMe();

  return (
    <Stack.Navigator headerMode="none" screenOptions={{ presentation: "modal" }}>
      <Stack.Screen name="Tabs" component={TabsNav} />
      <Stack.Screen name="Upload" component={Upload} />
    </Stack.Navigator>
  );
};

export default LoggedInNav;
