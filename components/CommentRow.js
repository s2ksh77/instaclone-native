import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../colors';
import useMe from '../hooks/useMe';
import { FOLLOW_USER_MUTATION, UNFOLLOW_USER_MUTATION } from '../query';
import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client';

const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
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

const Wrapper = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 10px;
  /* width: ${(props) => props.width}; */
`;
const Button = styled.TouchableOpacity`
  background-color: black;
  padding: 5px;
  border-radius: 4px;
  align-items: center;
`;
const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
`;

const CommentWrapper = styled.View`
  flex-direction: row;
`;

const Comment = styled.Text`
  color: white;
  margin: 0px 20px 0px 20px;
  width: ${(props) => props.width - 160};
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Row = styled.View`
  flex-direction: column;
  align-items: center;
  /* justify-content: space-between; */
`;

const COMMENTBTN = styled.TouchableOpacity`
  justify-content: center;
  padding: 5px;
  border-radius: 4px;
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const CommentRow = ({ id, payload, isMine, createdAt, updatedAt, photo, user }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const {
    data: { me },
  } = useMe();

  const deleteCommentUpdate = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (!ok) return;
    cache.evict({ id: `Comment:${id}` });
  };

  const [deleteCommentFn] = useMutation(DELETE_COMMENT, {
    variables: {
      id,
    },
    update: deleteCommentUpdate,
  });
  return (
    <Wrapper width={width}>
      <Column>
        <RowWrapper>
          <Avatar source={{ uri: user?.avatar }} />
          <Username>{user?.username}</Username>
        </RowWrapper>
        <RowWrapper>
          <Comment width={width}>{payload}</Comment>
          {isMine ? (
            <Button onPress={deleteCommentFn}>
              <ButtonText>✖</ButtonText>
            </Button>
          ) : null}
        </RowWrapper>
      </Column>
    </Wrapper>
  );
};

export default CommentRow;
