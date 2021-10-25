import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const Login = ({ navigation }) => {
  return (
    <View>
      <Text>Login</Text>
      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <View>
          <Text>Go to Create Account</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
