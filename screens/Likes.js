import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { USER_FRAGMENT } from '../fragments';
import ScreenLayout from '../components/ScreenLayout';
import { useState } from 'react/cjs/react.development';
import UserRow from '../components/UserRow';

const LIKES_QUERY = gql`
  query seePhotoLikes($id: Int!) {
    seePhotoLikes(id: $id) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

const Likes = ({ route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(LIKES_QUERY, {
    variables: {
      id: route?.params?.photoId,
    },
    skip: !route?.params?.photoId,
  });

  const renderUser = ({ item: user }) => <UserRow {...user} />;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.2)' }}
          />
        )}
        style={{ width: '100%' }}
        data={data?.seePhotoLikes}
        keyExtractor={(item) => '' + item.id}
        renderItem={renderUser}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </ScreenLayout>
  );
};

export default Likes;
