import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import AuthButton from '../components/auth/AuthButton';
import AuthLayout from '../components/auth/AuthLayout';
import { colors } from '../colors';

const LoginLink = styled.Text`
  color: ${colors.blue};
  font-weight: 500;
  margin-top: 20px;
  text-align: center;
`;

const Welcome = ({ navigation }) => {
  const goToCreateAccount = () => navigation.navigate('CreateAccount');
  const goToLogin = () => navigation.navigate('Login');
  return (
    <AuthLayout>
      <AuthButton disabled={false} text="계정 생성" onPress={goToCreateAccount} />
      <TouchableOpacity onPress={goToLogin}>
        <LoginLink>로그인</LoginLink>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default Welcome;
