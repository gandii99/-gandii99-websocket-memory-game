import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';

function LobbyView({ navigation, route }) {
  let socket = React.useRef(null);
  React.useEffect(() => {
    socket = io('http://192.168.1.111:3000');
    socket.emit('join room', route.params.roomName, 'janek');
    console.log('xd');
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{route.params.roomsName}</Text>
      <Button title="go next" onPress={() => navigation.navigate('Details')} />
    </View>
  );
}

export default LobbyView;
