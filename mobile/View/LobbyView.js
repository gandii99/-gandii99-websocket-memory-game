import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';

function LobbyView({ navigation, route }) {
  let socket = React.useRef(null);
  const [playersLobby, setPlayerLobby] = useState(null);

  React.useEffect(() => {
    socket = io('http://192.168.1.111:3000');
    socket.emit('join room', route.params.roomName, 'janek');

    socket.on('lobby players', (players) => {
      setPlayerLobby(players);
      console.log(players);
    });
    return () => {
      socket.emit('close connection', route.params.roomName, 'janek');
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{route.params.roomsName}</Text>
      <Button title="go next" onPress={() => navigation.navigate('Details')} />
    </View>
  );
}

export default LobbyView;
