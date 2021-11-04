import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import useMe from '../hooks/useMe';
import Profile from '../components/Profile';
import { useQuery } from '@apollo/client';
import { SEE_PROFILE_QUERY } from '../query';

const Me = ({ navigation }) => {
  const { data: meData } = useMe();
  const { data, loading, refetch } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: meData?.me?.username,
    },
  });

  useEffect(() => {
    navigation.setOptions({
      title: meData?.me?.username,
    });
  }, []);

  return (
    <ScreenLayout loading={loading} isStyle={false}>
      <Profile {...data?.seeProfile} />
    </ScreenLayout>
  );
};
export default Me;
