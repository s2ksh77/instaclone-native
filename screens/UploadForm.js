import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../colors';
import DismissKeyboard from '../components/DismissKeyboard';

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
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 10px;
`;

const UploadForm = ({ route, navigation }) => {
  const { register, handleSubmit, setValue } = useForm();

  const HeaderRight = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('UploadForm', { file: chosenPhoto })}
    >
      <HeaderRightText>Next</HeaderRightText>
    </TouchableOpacity>
  );
  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
  );

  const onValid = ({ caption }) => {};

  useEffect(() => {
    register('caption');
  }, [register]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, []);

  return (
    <DismissKeyboard>
      <Container>
        <Photo
          resizemODE="contain"
          source={{ uri: route?.params?.file }}
          style={{ flex: 1 }}
        />
        <CaptionContainer>
          <Caption
            placeholder="Write a caption"
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
