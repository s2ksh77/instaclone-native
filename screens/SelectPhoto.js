import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import * as MediaLibrary from 'expo-media-library';
import {
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { colors } from '../colors';

const Container = styled.View`
  flex: 1;
  background-color: black;
`;

const Top = styled.View`
  flex: 1;
`;

const Bottom = styled.View`
  flex: 1;
`;

const ImageContainer = styled.TouchableOpacity``;
const IconContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 0px;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 10px;
`;

const SelectPhoto = ({ navigation }) => {
  const [ok, setOk] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [os, setOs] = useState('android');
  const [chosenPhoto, setChosenPhoto] = useState('');
  const numColumns = 4;
  const { width } = useWindowDimensions();

  const getPhotos = async () => {
    const { assets: photos } = await MediaLibrary.getAssetsAsync();
    setPhotos(photos);
    setChosenPhoto(photos[0]?.uri);
  };

  const getPermissions = async () => {
    if (Platform.OS === 'ios') setOs('ios');
    if (os === 'ios') {
      const { accessPrivileges, canAskAgain } = await MediaLibrary.getPermissionsAsync();
      if (accessPrivileges === 'none' && canAskAgain) {
        const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();
        if (accessPrivileges !== 'none') {
          setOk(true);
          getPhotos();
        }
      } else if (accessPrivileges !== 'none') {
        setOk(true);
        getPhotos();
      }
    } else {
      const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
      if (status === 'undetermined' && canAskAgain) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'undetermined') {
          setOk(true);
          getPhotos();
        }
      } else if (status !== 'undetermined') {
        setOk(true);
        getPhotos();
      }
    }
  };

  const choosePhoto = (uri) => {
    setChosenPhoto(uri);
  };

  const renderItem = ({ item: photo }) => (
    <ImageContainer onPress={() => choosePhoto(photo.uri)}>
      <Image
        source={{ uri: photo.uri }}
        style={{ width: width / numColumns, height: 100 }}
      />
      <IconContainer>
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={photo.uri === chosenPhoto ? colors.blue : 'white'}
        />
      </IconContainer>
    </ImageContainer>
  );

  const HeaderRight = () => (
    <TouchableOpacity>
      <HeaderRightText>Next</HeaderRightText>
    </TouchableOpacity>
  );

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  });

  return (
    <Container>
      <Top>
        {chosenPhoto !== '' ? (
          <Image source={{ uri: chosenPhoto }} style={{ width, height: '100%' }} />
        ) : null}
      </Top>
      <Bottom>
        <FlatList
          data={photos}
          numColumns={numColumns}
          keyExtractor={(photo) => photo.id}
          renderItem={renderItem}
        />
      </Bottom>
    </Container>
  );
};

export default SelectPhoto;
