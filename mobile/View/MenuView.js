import * as React from 'react';
import { Button, View, Text } from 'react-native';
import PlayerNameBox from '../Components/PlayerNameBox';

function MenuView({ navigation }) {
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
      <PlayerNameBox />
    </View>
  );
}

export default MenuView;
