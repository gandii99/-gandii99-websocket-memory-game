import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import io from 'socket.io-client';
import { AuthContext, SocketContext } from '../App';
import PlayerNameBox from '../Components/PlayerNameBox';

function LobbyView({ navigation, route }) {
  const { playerName } = React.useContext(AuthContext);
  const { socket } = React.useContext(SocketContext);

  const [playersLobby, setPlayerLobby] = useState([]);

  React.useEffect(() => {
    socket.current = io('http://192.168.1.113:3000');
    socket.current.emit('join room', route.params.roomName, playerName);

    socket.current.on('lobby players', (players) => {
      setPlayerLobby(players);
    });

    socket.current.on('go to gameView', () => {
      console.log('Przejscie na GameView');
      navigation.navigate('GameView');
    });

    return () => {
      socket.current.emit(
        'force close connection',
        route.params.roomName,
        playerName
      );
      socket.current.close('jacuś');
    };
  }, []);

  const initialStartGame = () => {
    if (playersLobby.length !== 2) {
      console.log('Zła liczba graczy');
      return;
    }
    socket.current.emit('initial start game', route.params.roomName);
  };

  console.log(playersLobby);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{route.params.roomsName}</Text>
      {playersLobby.map((player) => {
        console.log('here', player);
        return <Text key={player.playerId}>{player.name}</Text>;
      })}
      <Button title="go next" onPress={initialStartGame} />
      <PlayerNameBox />
    </View>
  );
}

export default LobbyView;
