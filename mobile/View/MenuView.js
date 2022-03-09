import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function MenuView({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Memory</Text>
      <Button
        title="Singleplayer"
        onPress={() => navigation.navigate('RoomView')}
      />
      <Button
        title="Multiplayer"
        onPress={() => navigation.navigate('RoomView')}
      />
    </View>
  );
}

export default MenuView;
