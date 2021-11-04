import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import { PHOTO_FRAGMENT } from '../fragments';
import Photo from '../components/Photo';
import ScreenLayout from '../components/ScreenLayout';
import { useState } from 'react/cjs/react.development';
import Profile from '../components/Profile';
import { SEE_PROFILE_QUERY } from '../query';

const ProfileScreen = ({ navigation, route }) => {
  const { data, loading, refetch } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: route?.params?.username,
    },
  });

  useEffect(() => {
    if (route?.params?.username) {
      navigation.setOptions({
        title: route?.params?.username,
      });
    }
  }, []);

  return (
    <ScreenLayout loading={loading} isStyle={false}>
      <Profile {...data?.seeProfile} />
    </ScreenLayout>
  );
};
export default ProfileScreen;
