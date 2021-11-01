import { useQuery } from '@apollo/client';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { PHOTO_FRAGMENT, COMMENT_FRAGMENT } from '../fragments';
import { gql } from '@apollo/client';
import ScreenLayout from '../components/ScreenLayout';
import Photo from '../components/Photo';

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      ...PhotoFragment
      user {
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

const Feed = () => {
  const { data, loading } = useQuery(FEED_QUERY);

  const renderPhoto = ({ item: photo }) => {
    console.log(photo);
    return <Photo {...photo} />;
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        data={data?.seeFeed}
        keyExtractor={(photo) => '' + photo.id}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
};
export default Feed;
