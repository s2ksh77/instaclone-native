import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import { PHOTO_FRAGMENT } from '../fragments';
import Photo from '../components/Photo';
import ScreenLayout from '../components/ScreenLayout';
import { useState } from 'react/cjs/react.development';
import Profile from '../components/Profile';

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      firstName
      lastName
      username
      bio
      avatar
      photos {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

const ProfileScreen = ({ navigation, route }) => {
  const { data, loading, refetch } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: route?.params?.username,
    },
  });
  const [refresing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

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
