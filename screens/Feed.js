import { useQuery } from '@apollo/client';
import React from 'react';
import { Text, View } from 'react-native';
import { PHOTO_FRAGMENT, COMMENT_FRAGMENT } from '../fragments';

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
  const { data } = useQuery(FEED_QUERY);

  return (
    <View
      style={{
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: 'white' }}>Feed</Text>
    </View>
  );
};
export default Feed;
