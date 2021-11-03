import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import useMe from '../hooks/useMe';
import Profile from '../components/Profile';
import { gql, useQuery } from '@apollo/client';
import { PHOTO_FRAGMENT } from '../fragments';

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
