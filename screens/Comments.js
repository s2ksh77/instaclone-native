import React, { useRef } from 'react';
import { FlatList, Keyboard, Text, View } from 'react-native';
import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT, USER_FRAGMENT } from '../fragments';
import ScreenLayout from '../components/ScreenLayout';
import { useEffect, useState } from 'react/cjs/react.development';
import UserRow from '../components/UserRow';
import CommentRow from '../components/CommentRow';
import styled, { css } from 'styled-components/native';
import { useNavigation } from '@react-navigation/core';
import { COMMENTS_QUERY } from '../query';
import AuthLayout from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/AuthShared';
import { useForm } from 'react-hook-form';
import useMe from '../hooks/useMe';
import AuthButton from '../components/auth/AuthButton';

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

const CommentWrapper = styled.View`
  flex: 1;
`;

const InputWrapper = styled.View``;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

export default function Comments({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(false);
  const inputRef = useRef(null);
  const { data, loading, refetch } = useQuery(COMMENTS_QUERY, {
    variables: {
      id: route?.params?.photoId,
    },
    skip: !route?.params?.photoId,
  });
  alert(data);
  const [isFocus, setIsFocus] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      payload: '',
    },
  });
  const { data: userData } = useMe();

  const createCommentUpdate = async (cache, result) => {
    const { payload } = getValues();
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;
    if (ok && userData?.me) {
      await refetch();
      inputRef?.current?.clear();
      Keyboard.dismiss();
    }
  };
  const [createCommentMutation, { loading: createLoading }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      update: createCommentUpdate,
    }
  );

  const onValid = (data) => {
    const { payload } = data;
    if (createLoading) return;
    createCommentMutation({
      variables: {
        photoId: route?.params?.photoId,
        payload,
      },
    });
  };

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

  useEffect(() => {
    register('payload');
  }, [register]);

  return (
    <ScreenLayout loading={loading} isStyle={false}>
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
        <FlatList
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
              }}
            />
          )}
          style={{ width: '100%' }}
          data={data?.seePhotoComments}
          keyExtractor={(item) => '' + item.id}
          renderItem={renderComment}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </CommentWrapper>
      <InputWrapper>
        <AuthLayout isLogin={false}>
          <Wrapper style={{ borderWidth: 0 }}>
            <Avatar source={{ uri: userData?.me?.avatar }} />
            <TextInput
              ref={inputRef}
              placeholder="댓글 달기"
              onSubmitEditing={handleSubmit(onValid)}
              placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
              onChangeText={(text) => setValue('payload', text)}
              style={{ width: '75%' }}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            />
            <Button onPress={handleSubmit(onValid)}>
              <ButtonText>게시</ButtonText>
            </Button>
          </Wrapper>
        </AuthLayout>
      </InputWrapper>
    </ScreenLayout>
  );
}
