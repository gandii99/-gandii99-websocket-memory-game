import React, { useState } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SocketContext } from '../App';
import '../style.css';

function GameView({ navigation, route }) {
  const { socket, currentRoomId } = React.useContext(SocketContext);
  const [gameState, setGameState] = useState(null);
  const [isGameFinish, setIsGameFinish] = useState(false);
  const [winner, setWinner] = useState(null);

  const { initialGameState } = route.params;
  const getGameState = () => {
    return gameState;
  };
  console.log(gameState, '12 gamestate');
  React.useEffect(() => {
    setGameState(initialGameState);
    console.log('initialGameState: ', initialGameState);

    socket.current.on('game state', (gameStateX) => {
      console.log('here xd: ', gameStateX);
      setGameState(gameStateX);
    });

    socket.current.on('finish game', (winner) => {
      console.log(gameState);
      setWinner(winner);
      setIsGameFinish(true);
    });
  }, []);

  React.useEffect(() => {
    console.log(gameState, 'xdddd');

    function cos() {
      let ourId = gameState.players.findIndex((player) => {
        return player.playerId === socket.current.id;
      });
      setIsGameFinish(true);
      setWinner(ourId);
    }

    socket.current.on('oponent disconected', cos);
    return () => socket.current.off('oponent disconected', cos);
  }, [gameState]);

  const handleOnPress = (index) => {
    socket.current.emit('select field', currentRoomId, index);
  };
  //card--${field.state}
  console.log(
    'here',
    gameState?.gameState.nextPlayer,
    socket.id,
    socket.current.id
  );
  return (
    <View style={styles.container}>
      {gameState
        ? gameState.gameState.board.map((field, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleOnPress(index)}
                disabled={gameState.gameState.nextPlayer !== socket.current.id}
                style={[styles.card, styles[field.state]]}
              >
                <Text>{field.symbol + ' ' + field.state}</Text>
              </TouchableOpacity>
            );
          })
        : null}
      {isGameFinish ? (
        winner !== null ? (
          <Text>Wygrał {gameState.players[winner].name}!</Text>
        ) : (
          <Text>Remis!</Text>
        )
      ) : null}
      <View style={styles.playersBoard}>
        {socket.current.id === gameState?.gameState.nextPlayer ? (
          <Text>Now is your's move!</Text>
        ) : (
          <Text>Now is opponent's move!</Text>
        )}
      </View>
      <View style={styles.playersBoard}>
        <View style={styles.assidePlayersBoard}>
          <Text>{gameState?.players[0].name}</Text>
          <Text>{gameState?.players[0].score}</Text>
        </View>
        <View style={styles.assidePlayersBoard}>
          <Text>{gameState?.players[1].name}</Text>
          <Text>{gameState?.players[1].score}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    height: '90px',
    backgroundColor: 'black',
    flexBasis: '100px',
  },
  hide: {
    backgroundColor: 'burlywood',
  },
  selected: {
    backgroundColor: 'green',
  },
  guessed: {
    backgroundColor: 'purple',
  },
  playersBoard: {},
});

export default GameView;
