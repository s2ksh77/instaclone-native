import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import ScreenLayout from '../components/ScreenLayout';
import styled from 'styled-components/native';
import Comments from '../components/Comments';
import { RefreshControl, ScrollView } from 'react-native';
import { COMMENTS_QUERY } from '../query';

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
  margin: 0px;
`;

const CommentWrapper = styled.View``;

export default function CommentsScreen({ navigation, route }) {
  const [isFocus, setIsFocus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: '댓글',
    });
  }, []);

  return (
    <ScreenLayout isStyle={false}>
      <CommentWrapper isFocus={isFocus}>
        <Wrapper>
          <Column>
            <Avatar source={{ uri: route?.params?.avatar }} />
            <Username>{route?.params?.username}</Username>
          </Column>
          <Column>
            <Caption>{route?.params?.caption}</Caption>
          </Column>
        </Wrapper>
      </CommentWrapper>
      <Comments photoId={route?.params?.photoId} />
    </ScreenLayout>
  );
}
