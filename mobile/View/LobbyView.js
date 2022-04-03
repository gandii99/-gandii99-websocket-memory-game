import React, { useState } from 'react';
import { Button, View, Text, Pressable, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import { AuthContext, SocketContext } from '../App';
import PlayerNameBox from '../Components/PlayerNameBox';

function LobbyView({ navigation, route }) {
  const { playerName } = React.useContext(AuthContext);
  const { socket, currentRoomId, setCurrentRoomId } =
    React.useContext(SocketContext);
  const [playersLobby, setPlayerLobby] = useState([]);

  React.useEffect(() => {
    socket.current = io('http://192.168.0.105:3000');
    socket.current.emit('join room', currentRoomId, playerName);

    socket.current.on('lobby players', (players) => {
      setPlayerLobby(players);
    });

    socket.current.on('go to gameView', (initialGameState) => {
      navigation.navigate('GameView', { initialGameState });
    });

    return () => {
      socket.current.emit(
        'force close connection',
        route.params.roomName,
        playerName
      );
      // socket.current.close('jacuś');
    };
  }, []);

  const initialStartGame = () => {
    if (playersLobby.length !== 2) {
      console.log('Zła liczba graczy');
      return;
    }
    socket.current.emit('initial start game', currentRoomId);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.title}>Lobby</Text>
      {playersLobby.map((player) => {
        return <Text style={styles.playerCard} key={player.playerId}>{player.name}</Text>;
      })}
      <Pressable onPress={initialStartGame} style={styles.button} >
        <Text style={styles.text}>start game</Text>
      </Pressable>
      <PlayerNameBox />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 60,
    letterSpacing:2,
    color: '#3625cc',
    fontWeight: "bold",
    marginBottom: 80
  },
  button: {
    marginTop: 20,
    width: 200,
    height: 44,
    padding: 8,
    backgroundColor: '#rgb(248,95,106)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',

  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  playerCard: {
    height: 70,
    fontSize: 24,
    color: '#1c1c1c',
  }
})

export default LobbyView;
