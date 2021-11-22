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
import { FlatList, Keyboard, View } from 'react-native';

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

const Comments = ({ photoId }) => {
  const inputRef = useRef(null);
  const { data, loading, refetch } = useQuery(COMMENTS_QUERY, {
    variables: {
      id: photoId,
    },
  });
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

  const onValid = ({ payload }) => {
    if (createLoading) return;
    createCommentMutation({
      variables: {
        photoId,
        payload,
      },
    });
  };

  const renderComment = ({ item: comment }) => <CommentRow {...comment} />;

  useEffect(() => {
    register('payload');
  }, [register]);

  return (
    <OutWrapper>
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
      />
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
            />
            <Button onPress={handleSubmit(onValid)}>
              <ButtonText>게시</ButtonText>
            </Button>
          </Wrapper>
        </AuthLayout>
      </InputWrapper>
    </OutWrapper>
  );
};

export default Comments;
