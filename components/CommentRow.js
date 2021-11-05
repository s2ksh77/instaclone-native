import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../colors';
import useMe from '../hooks/useMe';
import { FOLLOW_USER_MUTATION, UNFOLLOW_USER_MUTATION } from '../query';

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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  width: ${(props) => props.width};
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

const Comment = styled.Text`
  color: white;
  margin: 0px 20px 0px 20px;
  width: ${(props) => props.width};
`;

const RowWrapper = styled.View``;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const COMMENTBTN = styled.TouchableOpacity`
  justify-content: center;
  padding: 5px;
  border-radius: 4px;
`;

const CommentRow = ({ id, payload, isMine, createdAt, updatedAt, photo, user }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const {
    data: { me },
  } = useMe();

  const getButton = () => {
    if (isMe) return null;
    if (isFollowing)
      return (
        <Button onPress={unFollowFn}>
          <ButtonText>팔로잉</ButtonText>
        </Button>
      );
    else
      return (
        <Button onPress={followFn}>
          <ButtonText>팔로우</ButtonText>
        </Button>
      );
  };
  return (
    <Wrapper width={width}>
      <Column>
        <Avatar source={{ uri: user?.avatar }} />
        <Username>{user?.username}</Username>
        <RowWrapper>
          <Row>
            <Comment width={width}>{payload}</Comment>
          </Row>
          {/* <Button>
            <ButtonText>댓글 달기</ButtonText>
          </Button> */}
        </RowWrapper>
      </Column>
    </Wrapper>
  );
};

export default CommentRow;
