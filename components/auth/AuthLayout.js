import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  useWindowDimensions,
} from 'react-native';
import styled, { css } from 'styled-components/native';

const Container = styled.View`
  ${(props) =>
    props.isLogin
      ? css`
          flex: 1;
        `
      : ''}
  align-items: center;
  justify-content: center;
  background-color: black;
  padding: ${(props) => (props.isLogin ? '0px 40px' : '0px')};
`;

const Logo = styled.Image`
  max-width: 50%;
  width: 100%;
  height: 100px;
  margin: 0 auto;
  margin-bottom: ${(props) => (props.isLogin ? '20px' : '0px')};
`;

const AuthLayout = ({ children, isLogin = true }) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const { width } = useWindowDimensions();
  return (
    <TouchableWithoutFeedback
      style={{
        flex: 1,
        flexDirection: isLogin ? 'row' : 'column',
      }}
      onPress={dismissKeyboard}
      disabled={Platform.OS === 'web'}
    >
      <Container isLogin={isLogin}>
        <KeyboardAvoidingView
          style={{ width: isLogin ? '100%' : width }}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 50}
        >
          {isLogin ? (
            <Logo
              isLogin={isLogin}
              resizeMode="contain"
              source={require('../../assets/Instagram-logo.png')}
            />
          ) : null}
          {children}
        </KeyboardAvoidingView>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default AuthLayout;
