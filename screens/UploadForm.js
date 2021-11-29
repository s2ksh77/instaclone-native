import { useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../colors';
import DismissKeyboard from '../components/DismissKeyboard';
import { gql } from '@apollo/client';
import { FEED_PHOTO } from '../fragments';
import { ReactNativeFile } from 'apollo-upload-client';

const Container = styled.View`
  flex: 1;
  background-color: black;
  padding: 0px 50px;
`;
const Photo = styled.Image`
  height: 350px;
`;
const Caption = styled.TextInput`
  background-color: white;
  color: black;
  padding: 10px 20px;
  border-radius: 100px;
`;
const CaptionContainer = styled.View`
  margin-top: 30px;
  margin-bottom: 15px;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 10px;
`;

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      ...FeedPhoto
    }
  }
  ${FEED_PHOTO}
`;

const UploadForm = ({ route, navigation }) => {
  const { register, handleSubmit, setValue } = useForm();
  const updateUploadPhoto = (cache, result) => {
    const {
      data: { uploadPhoto },
    } = result;
    if (uploadPhoto.id) {
      cache.modify({
        id: 'ROOT_QUERY',
        fields: {
          seeFeed(prev) {
            return [uploadPhoto, ...prev];
          },
        },
      });
      navigation.navigate('Tabs');
    }
  };
  const [uploadPhotoMutation, { loading }] = useMutation(UPLOAD_PHOTO_MUTATION, {
    update: updateUploadPhoto,
  });

  const HeaderRight = () => (
    <TouchableOpacity onPress={handleSubmit(onValid)}>
      <HeaderRightText>Next</HeaderRightText>
    </TouchableOpacity>
  );
  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
  );

  const onValid = ({ caption }) => {
    const file = new ReactNativeFile({
      uri: route?.params?.file,
      name: `1.jpg`,
      type: 'image/jpeg',
    });
    uploadPhotoMutation({
      variables: {
        caption,
        file,
      },
    });
  };

  useEffect(() => {
    register('caption');
  }, [register]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);

  return (
    <DismissKeyboard>
      <Container>
        <Photo
          resizeMode="contain"
          source={{ uri: route?.params?.file }}
          style={{ flex: 1 }}
        />
        <CaptionContainer>
          <Caption
            placeholder="내용을 적으세요."
            placeholderTextColor="rgba(0,0,0,0.5)"
            onChangeText={(text) => setValue('caption', text)}
            onSubmitEditing={handleSubmit(onValid)}
            returnKeyType="done"
          />
        </CaptionContainer>
      </Container>
    </DismissKeyboard>
  );
};
export default UploadForm;
