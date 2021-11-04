import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const ScreenLayout = ({ loading, children, isStyle = true }) => {
  return (
    <View
      style={
        isStyle && loading
          ? {
              backgroundColor: 'black',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }
          : { backgroundColor: 'black', flex: 1 }
      }
    >
      {loading ? <ActivityIndicator color="white" backgroundColor="black" /> : children}
    </View>
  );
};

export default ScreenLayout;
