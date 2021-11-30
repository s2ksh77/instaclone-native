import React, { useRef, useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import ScreenLayout from '../components/ScreenLayout';
import CommentRow from '../components/CommentRow';
import styled, { css } from 'styled-components/native';
import { COMMENTS_QUERY } from '../query';
import AuthLayout from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/AuthShared';
import { useForm } from 'react-hook-form';
import useMe from '../hooks/useMe';
import {
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import UserRow from './UserRow';
import { useNavigation } from '@react-navigation/core';

const Header = styled.View`
  background-color: black;
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 5px 10px;
  border-width: 2px;
  border-bottom-color: white;
  margin: 0px;
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

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
`;

const InputWrapper = styled.View``;

const DataWrapper = styled.View`
  flex: 1;
`;

const OutWrapper = styled.View`
  flex: 1;
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

const Search = ({ photoData, userData }) => {
  const navigation = useNavigation();
  const nubColumns = 4;
  const { width } = useWindowDimensions();

  const goToPhoto = (photo) => {
    navigation.navigate('Photo', { photoId: photo?.id });
  };

  const renderItem = ({ item: photo }) => (
    <TouchableOpacity onPress={() => goToPhoto(photo)}>
      <Image
        source={{ uri: photo.file }}
        style={{ width: width / nubColumns, height: 100 }}
      />
    </TouchableOpacity>
  );

  const renderUserItem = ({ item: user }) => <UserRow {...user} />;

  return (
    <OutWrapper>
      <DataWrapper>
        {userData?.length > 0 && (
          <View
            style={{
              flex: 0,
              backgroundColor: 'black',
            }}
          >
            <FlatList
              data={userData}
              keyExtractor={(user) => '' + user.id}
              renderItem={renderUserItem}
            />
          </View>
        )}
        {photoData?.length > 0 && (
          <FlatList
            numColumns={nubColumns}
            data={photoData}
            keyExtractor={(photo) => '' + photo.id}
            renderItem={renderItem}
          />
        )}
      </DataWrapper>
    </OutWrapper>
  );
};

export default Search;
