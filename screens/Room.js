import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, View } from 'react-native';
import { gql, useQuery, useMutation } from '@apollo/client';
import ScreenLayout from '../components/ScreenLayout';
import styled from 'styled-components/native';
import { useForm } from 'react-hook-form';
import useMe from '../hooks/useMe';
import client from '../apollo';
import { Ionicons } from '@expo/vector-icons';

const MessageContainer = styled.View`
  padding: 0px 10px;
  flex-direction: ${(props) => (!props.outGoing ? 'row-reverse' : 'row')};
  align-items: flex-end;
`;
const Author = styled.View``;
const Avatar = styled.Image`
  width: 20px;
  height: 20px;
  border-radius: 25px;
`;

const Message = styled.Text`
  color: white;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  border-radius: 10px;
  overflow: hidden;
  font-size: 16px;
  margin: 0px 10px;
`;

const TextInput = styled.TextInput`
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  border-radius: 1000px;
  color: white;
  width: 90%;
  margin-right: 10px;
`;

const InputContainer = styled.View`
  margin: 25px 0px 10px 10px;
  width: 95%;
  flex-direction: row;
  align-items: center;
`;
const SendButton = styled.TouchableOpacity``;

const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        username
        avatar
      }
      read
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;

const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      messages {
        id
        payload
        user {
          username
          avatar
        }
        read
      }
    }
  }
`;

const Room = ({ route, navigation }) => {
  const { data, loading, refetch, subscribeToMore } = useQuery(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });
  const { data: meData } = useMe();
  const [subscribe, setSubscribed] = useState(false);
  const { register, handleSubmit, setValue, getValues, watch } = useForm();

  // 방이 하나일 땐 cache가 Room:1 형태가 아닌 Room 이다.. 그래서 캐시가 잘 안먹음..
  const updateSendMessage = async (cache, result) => {
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result;
    if (ok) {
      // const { payload } = getValues();
      // setValue('payload', '');
      // const messageObj = {
      //   __typename: 'Message',
      //   id,
      //   payload,
      //   user: {
      //     username: meData?.me?.username,
      //     avatar: meData?.me?.avatar,
      //   },
      //   read: true,
      // };
      // const messageFragment = cache.writeFragment({
      //   fragment: gql`
      //     fragment NewMessage on Message {
      //       id
      //       payload
      //       user {
      //         username
      //         avatar
      //       }
      //       read
      //     }
      //   `,
      //   data: meesageObj,
      // });
      // cache.modify({
      //   id: `Room:${route.params.id}`,
      //   fields: {
      //     messages(prev) {
      //       return [...prev, messageFragment];
      //     },
      //   },
      // });
      setValue('payload', '');
      await refetch();
    }
  };

  const [sendMessageMutation, { loading: sendLoading }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );

  useEffect(() => {
    navigation.setOptions({
      title: `Conversation with ${route?.params?.talkingTo?.username}`,
    });
  }, []);

  useEffect(() => {
    register('payload', { required: true });
  }, [register]);

  const updateQuery = async (prevQuery, options) => {
    const {
      subscriptionData: {
        data: { roomUpdates: message },
      },
    } = options;
    if (message.id) {
      const { cache } = client;
      // const messageFragment = cache.writeFragment({
      //   fragment: gql`
      //     fragment NewMessage on Message {
      //       id
      //       payload
      //       user {
      //         username
      //         avatar
      //       }
      //       read
      //     }
      //   `,
      //   data: message,
      // });
      // cache.modify({
      //   id: `Room:${route.params.id}`,
      //   fields: {
      //     messages(prev) {
      //       const existingMessage = prev.find(
      //         (aMessage) => aMessage.__ref === messageFragment.__ref
      //       );
      //       if (existingMessage) {
      //         return prev;
      //       }
      //       return [...prev, messageFragment];
      //     },
      //   },
      // });
      await refetch();
    }
  };

  useEffect(() => {
    if (data?.seeRoom) {
      subscribeToMore({
        document: ROOM_UPDATES,
        variables: {
          id: route?.params?.id,
        },
        updateQuery,
      });
      setSubscribed(true);
    }
  }, [data, subscribe]);

  const onValid = ({ payload }) => {
    if (!sendLoading) {
      sendMessageMutation({
        variables: {
          payload,
          roomId: route?.params?.id,
        },
      });
    }
  };

  const renderItem = ({ item: message }) => (
    <MessageContainer
      outGoing={message.user.username === route?.params?.talkingTo?.username}
    >
      <Author>
        <Avatar source={{ uri: message.user.avatar }} />
      </Author>
      <Message>{message.payload}</Message>
    </MessageContainer>
  );

  const messages = [...(data?.seeRoom?.messages ?? [])];
  messages.reverse();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'black' }}
      //   behavior="height"
      //   keyboardVerticalOffset={50}
    >
      <ScreenLayout loading={loading}>
        <FlatList
          style={{ width: '100%', marginVertical: 10 }}
          data={messages}
          keyExtractor={(message) => '' + message.id}
          renderItem={renderItem}
          inverted
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
        <InputContainer>
          <TextInput
            placeholder="Write a message..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            returnKeyLabel="전송"
            returnKeyType="send"
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={(text) => setValue('payload', text)}
            value={watch('payload')}
          />
          <SendButton
            disabled={!Boolean(watch('payload'))}
            onPress={handleSubmit(onValid)}
          >
            <Ionicons
              name="send"
              color={!Boolean(watch('payload')) ? 'rgba(255,255,255,0.5)' : 'white'}
              size={22}
            />
          </SendButton>
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
};

export default Room;
