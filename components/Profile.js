import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import { gql, useMutation, useQuery } from '@apollo/client';
import { PHOTO_FRAGMENT } from '../fragments';
import { colors } from '../colors';
import ScreenLayout from '../components/ScreenLayout';
import { useNavigation } from '@react-navigation/core';
import client from '../apollo';
import useMe from '../hooks/useMe';
import {
  SEE_PROFILE_QUERY,
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
} from '../query';
import { handleFollow, handleUnFollow } from '../logics/follow';

const Container = styled.View`
  background-color: black;
`;

const Header = styled.View`
  padding: 10px 15px 15px 15px;
  flex-direction: row;
  justify-content: space-between;
`;
const Avatar = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 25px;
  margin-left: 15px;
`;
const Column = styled.View`
  display: flex;
  flex-direction: row;
`;
const Row = styled.View`
  flex-direction: column;
  margin-right: 30px;
  align-items: center;
  justify-content: center;
`;
const Username = styled.Text``;
const Value = styled.Text`
  color: white;
  margin-bottom: 10px;
`;

const HeaderCaption = styled.View`
  padding: 10px 15px 15px 15px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
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

const PhotoContainer = styled.View`
  height: 100%;
`;

const Profile = ({
  id,
  username,
  avatar,
  photos,
  totalFollowers,
  totalFollowing,
  bio,
  isMe,
  isFollowing,
}) => {
  const navigation = useNavigation();
  const numColumns = 4;
  const { width } = useWindowDimensions();
  const {
    data: { me },
  } = useMe();

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

  const renderItem = ({ item: photo }) => (
    <TouchableOpacity
      style={{ flexWrap: 'nowrap' }}
      onPress={() =>
        navigation.navigate('Photo', {
          photoId: photo.id,
        })
      }
    >
      <Image
        source={{ uri: photo.file }}
        style={{
          width: width / numColumns - 10,
          height: 100,
          margin: 5,
        }}
      />
    </TouchableOpacity>
  );

  const getButton = () => {
    if (isMe)
      return (
        <Button style={{ backgroundColor: 'white' }}>
          <ButtonText style={{ color: 'black' }}>프로필 편집</ButtonText>
        </Button>
      );
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
    <Container>
      <Header>
        <Column>
          <Avatar source={{ uri: avatar }} />
        </Column>
        <Column>
          <Row>
            <Value>{photos?.length}</Value>
            <Value>게시물</Value>
          </Row>
          <Row>
            <Value>{totalFollowers}</Value>
            <Value>팔로워</Value>
          </Row>
          <Row>
            <Value>{totalFollowing}</Value>
            <Value>팔로잉</Value>
          </Row>
        </Column>
      </Header>
      <HeaderCaption>
        <Value>{bio}</Value>
      </HeaderCaption>
      <ButtonContainer>
        {getButton()}
        {isMe ? null : (
          <Button style={{ backgroundColor: 'white' }}>
            <ButtonText style={{ color: 'black' }}>{'메시지'}</ButtonText>
          </Button>
        )}
      </ButtonContainer>
      <PhotoContainer>
        <FlatList
          data={photos}
          keyExtractor={(photo) => photo.id}
          renderItem={renderItem}
          numColumns={numColumns}
        />
      </PhotoContainer>
    </Container>
  );
};
export default Profile;
