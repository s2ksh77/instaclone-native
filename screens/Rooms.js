import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import { ROOMS_FRAGMENT } from '../fragments';
import styled from 'styled-components/native';
import ScreenLayout from '../components/ScreenLayout';
import useMe from '../hooks/useMe';
import RoomItem from '../components/rooms/RoomItem';

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOMS_FRAGMENT}
`;

const Rooms = ({ navigation }) => {
  const { data, loading } = useQuery(SEE_ROOMS_QUERY);
  const { data: meData } = useMe();

  const renderItem = ({ item: room }) => {
    return <RoomItem {...room} />;
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        style={{ width: '100%' }}
        data={data?.seeRooms}
        keyExtractor={(room) => '' + room.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View
            style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.2)' }}
          />
        )}
      />
    </ScreenLayout>
  );
};

export default Rooms;
