import * as React from 'react';
import { Button, View, Text } from 'react-native';
import PlayerNameBox from '../Components/PlayerNameBox';
import { SocketContext } from '../App';

function RoomView({ navigation }) {
  const [rooms, setRooms] = React.useState(null);
  const { currentRoomId, setCurrentRoomId } = React.useContext(SocketContext);

  React.useEffect(() => {
    fetch('http://192.168.1.113:3000/rooms')
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Room sc</Text>
      {rooms != null
        ? rooms.map((room) => {
            return (
              <Button
                key={room.roomId}
                title={room.roomId + ' - ' + room.players.length + '/2'}
                onPress={() => {
                  setCurrentRoomId(room.roomId);
                  navigation.navigate('LobbyView', { roomName: room.roomId });
                }}
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
