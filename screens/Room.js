import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { gql, useQuery } from '@apollo/client';

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
  const { data } = useQuery(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });
  console.log(data);

  useEffect(() => {
    navigation.setOptions({
      title: `Conversation with ${route?.params?.talkingTo?.username}`,
    });
  }, []);
  return (
    <View>
      <Text>Message List</Text>
    </View>
  );
};

export default Room;
