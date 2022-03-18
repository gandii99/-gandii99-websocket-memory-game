import * as React from 'react';
import { Button, View, Text } from 'react-native';
import PlayerNameBox from '../Components/PlayerNameBox';

function RoomView({ navigation }) {
  const [rooms, setRooms] = React.useState(null);

  React.useEffect(() => {
    fetch('http://192.168.1.113:3000/rooms')
      .then((response) => response.json())
      .then((data) => {
        setRooms(Object.entries(data));
        console.log(Object.entries(data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log(rooms);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Room sc</Text>
      {rooms != null
        ? rooms.map((entry) => {
            return (
              <Button
                key={entry[0]}
                title={entry[0] + ' /' + entry[1].players.length}
                onPress={() =>
                  navigation.navigate('LobbyView', { roomName: entry[0] })
                }
              ></Button>
            );
          })
        : null}
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <PlayerNameBox />
    </View>
  );
}

export default RoomView;
