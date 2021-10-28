import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import AuthButton from '../components/auth/AuthButton';
import AuthLayout from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/AuthShared';
import FormError from '../components/auth/FormError';

const CreateAccount = ({ navigation }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const lastNameRef = useRef();
  const userNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };
  const onDone = () => {
    alert('done');
  };

  const onValid = (data) => {
    console.log(data);
  };

  useEffect(() => {
    register('firstName', {
      required: true,
    });
    register('lastName', {
      required: true,
    });
    register('username', {
      required: true,
      minLength: {
        value: 5,
        message: 'FirstName should be longer than 5 chars.',
      },
    });
    register('email', {
      required: true,
    });
    register('password', {
      required: true,
    });
  }, [register]);

  return (
    <AuthLayout>
      <TextInput
        autoFocus
        placeholder="First Name"
        returnKeyType="next"
        onSubmitEditing={() => onNext(lastNameRef)}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onChangeText={(text) => setValue('firstName', text)}
      />
      <TextInput
        ref={lastNameRef}
        placeholder="Last Name"
        returnKeyType="next"
        onSubmitEditing={() => onNext(userNameRef)}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onChangeText={(text) => setValue('lastName', text)}
      />
      <TextInput
        ref={userNameRef}
        placeholder="Username"
        returnKeyType="next"
        onSubmitEditing={() => onNext(emailRef)}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onChangeText={(text) => setValue('username', text)}
        autoCapitalize={'none'}
        hasError={Boolean(errors?.username?.message)}
      />
      <FormError message={errors?.username?.message} />
      <TextInput
        ref={emailRef}
        placeholder="Email"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => onNext(passwordRef)}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onChangeText={(text) => setValue('email', text)}
      />
      <TextInput
        ref={passwordRef}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onValid)}
        lastOne={true}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onChangeText={(text) => setValue('password', text)}
      />
      <AuthButton
        text="Create Account"
        disabled={false}
        onPress={handleSubmit(onValid)}
        loading
      />
    </AuthLayout>
  );
};
export default CreateAccount;
