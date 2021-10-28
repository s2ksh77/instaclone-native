import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AuthButton from '../components/auth/AuthButton';
import AuthLayout from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/AuthShared';

const Login = ({ navigation }) => {
  return (
    <AuthLayout>
      <TextInput
        placeholder="Username"
        returnKeyType="next"
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
      />
      <AuthButton text="Log In" disabled={false} onPress={() => null} />
    </AuthLayout>
  );
};

export default Login;
