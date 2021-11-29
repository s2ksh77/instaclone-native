import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import DismissKeyboard from '../components/DismissKeyboard';
import { gql, useLazyQuery } from '@apollo/client';
import { USER_FRAGMENT } from '../fragments';
import UserRow from '../components/UserRow';

const Input = styled.TextInput`
  background-color: rgba(255, 255, 255, 1);
  width: ${(props) => props.width / 1.5}px;
  color: black;
  padding: 5px 10px;
  border-radius: 7px;
`;

const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const MessageText = styled.Text`
  margin-top: 15px;
  color: white;
  font-weight: 600;
`;

const SEARCH_PHOTOS = gql`
  query searchPhotos($keyword: String!) {
    searchPhotos(keyword: $keyword) {
      id
      file
    }
  }
`;

const SEARCH_USERS = gql`
  query searchUsers($keyword: String!) {
    searchUsers(keyword: $keyword) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

const Search = ({ navigation }) => {
  const nubColumns = 4;
  const { width } = useWindowDimensions();
  const { register, setValue, watch, handleSubmit } = useForm();
  const onCompleted = () => setValue('keyword', '');

  const [startQueryFn, { loading, data, called }] = useLazyQuery(SEARCH_PHOTOS, {
    onCompleted,
  });
  const [searchUserQuery, { data: userData }] = useLazyQuery(SEARCH_USERS, {
    onCompleted,
  });

  const onValid = ({ keyword }) => {
    startQueryFn({
      variables: {
        keyword,
      },
    });
    searchUserQuery({
      variables: {
        keyword,
      },
    });
  };

  const SearchBox = () => (
    <Input
      width={width}
      style={{ backgroundColor: 'white' }}
      placeholderTextColor="rgba(0,0,0,0.8)"
      placeholder="검색"
      value={watch('keyword')}
      autoCapitalize="none"
      returnKeyLabel="Search"
      returnKeyType="search"
      onChangeText={(text) => setValue('keyword', text)}
      autoCorrect={false}
      onSubmitEditing={handleSubmit(onValid)}
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
    register('keyword', {
      required: true,
      minLength: 1,
      setValueAs: null,
    });
  });

  const renderItem = ({ item: photo }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Photo', {
          photoId: photo.id,
        })
      }
    >
      <Image
        source={{ uri: photo.file }}
        style={{ width: width / nubColumns, height: 100 }}
      />
    </TouchableOpacity>
  );

  const renderUserItem = ({ item: user }) => <UserRow {...user} />;

  return (
    <DismissKeyboard>
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
        }}
      >
        {loading ? (
          <MessageContainer>
            <ActivityIndicator size="large" />
            <MessageText>검색 중....</MessageText>
          </MessageContainer>
        ) : null}
        {!called ? (
          <MessageContainer>
            <MessageText>검색 하세요.</MessageText>
          </MessageContainer>
        ) : null}
        {userData?.searchUsers !== undefined ? (
          userData?.searchUsers?.length === 0 ? null : (
            <View
              style={{
                flex: 0,
                backgroundColor: 'black',
              }}
            >
              <FlatList
                data={userData?.searchUsers}
                keyExtractor={(user) => '' + user.id}
                renderItem={renderUserItem}
              />
            </View>
          )
        ) : null}
        {data?.searchPhotos !== undefined ? (
          data?.searchPhotos?.length === 0 ? null : (
            <FlatList
              numColumns={nubColumns}
              data={data?.searchPhotos}
              keyExtractor={(photo) => '' + photo.id}
              renderItem={renderItem}
            />
          )
        ) : null}
      </View>
    </DismissKeyboard>
  );
};
export default Search;
