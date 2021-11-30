import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
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
import Search from '../components/Search';

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

export default function SearchScreen({ navigation }) {
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
  }, []);

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
        <ScrollView>
          <Search photoData={data?.searchPhotos} userData={userData?.searchUsers} />
        </ScrollView>
      </View>
    </DismissKeyboard>
  );
}
