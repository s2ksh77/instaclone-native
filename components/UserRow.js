import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../colors';
import useMe from '../hooks/useMe';
import { handleFollow, handleUnFollow } from '../logics/follow';
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
`;
const Button = styled.TouchableOpacity`
  background-color: ${colors.blue};
  justify-content: center;
  padding: 10px 20px;
  border-radius: 4px;
  margin: 0px 15px 15px 0px;
`;
const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
`;

const UserRow = ({ id, avatar, username, isFollowing, isMe }) => {
  const navigation = useNavigation();
  const {
    data: { me },
  } = useMe();

  const handleFollow = (cache, result) => {
    const {
      data: {
        followUser: { ok },
      },
    } = result;

    if (!ok) return;

    cache.modify({
      id: `User:${id}`,
      fields: {
        isFollowing(prev) {
          return !prev;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });
    cache.modify({
      id: `User:${me.id}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };

  const handleUnFollow = (cache, result) => {
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;
    if (!ok) return;

    cache.modify({
      id: `User:${id}`,
      fields: {
        isFollowing(prev) {
          return !prev;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });
    cache.modify({
      id: `User:${me.id}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [followFn] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    update: handleFollow,
  });

  const [unFollowFn] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    update: handleUnFollow,
  });

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
    <Wrapper>
      <Column
        onPress={() =>
          navigation.navigate('Profile', {
            id,
            username,
          })
        }
      >
        <Avatar source={{ uri: avatar }} />
        <Username>{username}</Username>
      </Column>
      {getButton()}
    </Wrapper>
  );
};

export default UserRow;
