import React, { useState } from 'react';
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
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
      socket.current.disconnect();
    });
  }, []);

  React.useEffect(() => {
    console.log(gameState, 'xdddd');

    function cos() {
      if (isGameFinish) return;
      let ourId = gameState.players.findIndex((player) => {
        return player.playerId === socket.current.id;
      });
      setIsGameFinish(true);
      setWinner(ourId);
    }

    socket.current.on('oponent disconected', cos);
    return () => socket.current.off('oponent disconected', cos);
  }, [gameState, isGameFinish]);

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
                <Text>{field.state !== 'hide' ? field.symbol : ''}</Text>
              </TouchableOpacity>
            );
          })
        : null}
      {isGameFinish ? (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={winner !== null}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  {winner !== -1 ? (
                    <Text>Wygrał {gameState.players[winner].name}!</Text>
                  ) : (
                    <Text>Remis!</Text>
                  )}
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    socket.current.disconnect();
                    navigation.navigate('RoomView');
                  }}
                >
                  <Text style={styles.textStyle}>Back to RoomView</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
      <View style={styles.nextPlayerBox}>
        {socket.current.id === gameState?.gameState.nextPlayer ? (
          <Text style={styles.nextPlayerText}>Now is your's move!</Text>
        ) : (
          <Text style={styles.nextPlayerText}>Now is opponent's move!</Text>
        )}
      </View>
      <View style={styles.playersBoard}>
        <View style={styles.assidePlayersBoard}>
          <Text style={styles.player}>{gameState?.players[0].name}</Text>
          <Text style={styles.score}>score: {gameState?.players[0].score}</Text>
        </View>
        <View style={styles.assidePlayersBoard}>
          <Text style={styles.player}>{gameState?.players[1].name}</Text>
          <Text style={styles.score}>socre: {gameState?.players[1].score}</Text>
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
    width: '100%',
    padding: '20px',
  },
  card: {
    flexBasis: '20%',
    height: '15%',
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4c3999',
    fontSize: '30px',
  },
  hide: {
    backgroundColor: '#d92378',
  },
  selected: {
    backgroundColor: '#ebde8f',
  },
  guessed: {
    backgroundColor: '#d16a56',
  },
  playersBoard: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: '15px',
  },
  score: {
    fontSize: '30px',
    fontWeight: 'bold',
  },
  nextPlayerText: {
    fontSize: '40px',
  },
  nextPlayerBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  /// Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default GameView;
