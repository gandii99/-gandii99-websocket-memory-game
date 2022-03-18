import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { SocketContext } from '../App';

function GameView({ navigation }) {
  const { socket } = React.useContext(SocketContext);

  console.log(socket);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

export default GameView;
