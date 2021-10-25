import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const CreateAccount = ({ navigation }) => {
  return (
    <View>
      <Text>CreateAccount</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <View>
          <Text>Go to Login</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default CreateAccount;
