import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const ScreenLayout = ({ loading, children, isStyle = true }) => {
  return (
    <View
      style={
        isStyle
          ? {
              backgroundColor: 'black',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }
          : null
      }
    >
      {loading ? <ActivityIndicator color="white" /> : children}
    </View>
  );
};

export default ScreenLayout;
