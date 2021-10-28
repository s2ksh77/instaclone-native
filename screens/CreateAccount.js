import React, { useRef } from 'react';
import AuthButton from '../components/auth/AuthButton';
import AuthLayout from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/AuthShared';

const CreateAccount = ({ navigation }) => {
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

  return (
    <AuthLayout>
      <TextInput
        autoFocus
        placeholder="First Name"
        returnKeyType="next"
        onSubmitEditing={() => onNext(lastNameRef)}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
      />
      <TextInput
        ref={lastNameRef}
        placeholder="Last Name"
        returnKeyType="next"
        onSubmitEditing={() => onNext(userNameRef)}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
      />
      <TextInput
        ref={userNameRef}
        placeholder="Username"
        returnKeyType="next"
        onSubmitEditing={() => onNext(emailRef)}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
      />
      <TextInput
        ref={emailRef}
        placeholder="Email"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => onNext(passwordRef)}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
      />
      <TextInput
        ref={passwordRef}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={onDone}
        lastOne={true}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
      />
      <AuthButton text="Create Account" disabled={true} onPress={() => null} />
    </AuthLayout>
  );
};
export default CreateAccount;
