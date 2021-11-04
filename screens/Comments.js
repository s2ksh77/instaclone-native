import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { PHOTO_FRAGMENT, USER_FRAGMENT } from '../fragments';
import ScreenLayout from '../components/ScreenLayout';
import { useEffect, useState } from 'react/cjs/react.development';
import UserRow from '../components/UserRow';
import CommentRow from '../components/CommentRow';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/core';
import { COMMENTS_QUERY } from '../query';

const Header = styled.View`
  background-color: black;
`;
const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
`;
const Username = styled.Text`
  font-weight: 600;
  color: white;
`;
const Caption = styled.Text`
  font-weight: 600;
  color: white;
  margin-left: 15px;
`;
const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 5px 10px;
  border-width: 2px;
  border-bottom-color: white;
  margin: 0px 0px 25px 0px;
`;

const Comments = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(COMMENTS_QUERY, {
    variables: {
      id: route?.params?.photoId,
    },
  });

  const renderComment = ({ item: comment }) => <CommentRow {...comment} />;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      title: '댓글',
    });
  }, []);

  return (
    <ScreenLayout loading={loading} isStyle={false}>
      <Wrapper>
        <Column>
          <Avatar source={{ uri: route?.params?.avatar }} />
          <Username>{route?.params?.username}</Username>
        </Column>
        <Column>
          <Caption>{route?.params?.caption}</Caption>
        </Column>
      </Wrapper>
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.2)' }}
          />
        )}
        style={{ width: '100%' }}
        data={data?.seePhotoComments}
        keyExtractor={(item) => '' + item.id}
        renderItem={renderComment}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </ScreenLayout>
  );
};

export default Comments;
