import * as React from 'react';
import { Button, View, Text, StyleSheet, Pressable } from 'react-native';
import PlayerNameBox from '../Components/PlayerNameBox';
import { SocketContext } from '../App';

function RoomView({ navigation }) {
  const [rooms, setRooms] = React.useState(null);
  const { currentRoomId, setCurrentRoomId } = React.useContext(SocketContext);

  React.useEffect(() => {
    fetch('http://192.168.0.105:3000/rooms')
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room</Text>
      {rooms != null
        ? rooms.map((room) => {
            return (
              <Pressable
                key={room.roomId}
            
                onPress={() => {
                  setCurrentRoomId(room.roomId);
                  navigation.navigate('LobbyView', { roomName: room.roomId });
              
                }}
              
                style={styles.button}
              >
                <Text style={[styles.text]}>Room {room.roomId}</Text>
                <Text style={[styles.text]} >{room.players.length + '/2'}</Text>
              </Pressable>
            );
          })
        : null}
      <Pressable
        style={[styles.button, styles.accentButton]}
        onPress={() => navigation.navigate('MenuView')}
      >
        <Text style={styles.text}>Back</Text>
      </Pressable>
      <PlayerNameBox />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center' 
  },
  title: {
    fontSize: 60,
    letterSpacing:2,
    color: '#3625cc',
    fontWeight: "bold",
    marginBottom: 50
  },
  input: {
    width: 200,
    height: 44,
    padding: 8,
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 100,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    width: "60%",
    height: 44,
    padding: 8,
    backgroundColor: '#rgb(248,95,106)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  accentButton: {
    backgroundColor: '#3625cc',
    marginTop: 50,
    width: 200,
    justifyContent: 'center',
  },
})

export default RoomView;
