import React from 'react';
import styled from 'styled-components/native';
import {
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import UserRow from './UserRow';
import { useNavigation } from '@react-navigation/core';

const DataWrapper = styled.View`
  flex: 1;
`;

const OutWrapper = styled.View`
  flex: 1;
`;

const Search = ({ photoData, userData }) => {
  const navigation = useNavigation();
  const nubColumns = 4;
  const { width } = useWindowDimensions();

  const renderItem = ({ item: photo }) => (
    <TouchableOpacity
      style={{ flexWrap: 'nowrap' }}
      onPress={() =>
        navigation.navigate('Photo', {
          photoId: photo.id,
        })
      }
    >
      <Image
        source={{ uri: photo.file }}
        style={{ width: width / nubColumns, height: 100 }}
      />
    </TouchableOpacity>
  );

  const renderUserItem = ({ item: user }) => <UserRow {...user} />;

  return (
    <OutWrapper>
      <DataWrapper>
        {userData?.length > 0 && (
          <View
            style={{
              flex: 0,
              backgroundColor: 'black',
            }}
          >
            <FlatList
              data={userData}
              keyExtractor={(user) => '' + user.id}
              renderItem={renderUserItem}
            />
          </View>
        )}
        {photoData?.length > 0 && (
          <FlatList
            numColumns={nubColumns}
            data={photoData}
            keyExtractor={(photo) => '' + photo.id}
            renderItem={renderItem}
          />
        )}
      </DataWrapper>
    </OutWrapper>
  );
};

export default Search;
