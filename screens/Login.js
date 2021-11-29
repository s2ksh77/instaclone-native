import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import AuthButton from '../components/auth/AuthButton';
import AuthLayout from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/AuthShared';
import { gql, useMutation } from '@apollo/client';
import { isLoggedInVar, logUserIn } from '../apollo';

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

const Login = ({ route: { params } }) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      username: params?.username,
      password: params?.password,
    },
  });
  const passwordRef = useRef();
  const onCompleted = async (data) => {
    const {
      login: { ok, token },
    } = data;
    console.log(data);
    if (ok) {
      await logUserIn(token);
    }
  };
  const [logInMutaition, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });
  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };

  useEffect(() => {
    register('username', {
      required: true,
    });
    register('password', {
      required: true,
    });
  }, [register]);

  const onValid = (data) => {
    if (!loading) {
      logInMutaition({
        variables: {
          ...data,
        },
      });
    }
  };

  return (
    <AuthLayout>
      <TextInput
        value={watch('username')}
        placeholder="아이디"
        returnKeyType="next"
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={(text) => setValue('username', text)}
        autoCapitalize={'none'}
      />
      <TextInput
        value={watch('password')}
        ref={passwordRef}
        placeholder="비밀번호"
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text) => setValue('password', text)}
      />
      <AuthButton
        text="로그인"
        loading={loading}
        disabled={!watch('username') || !watch('password')}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
};

export default Login;
