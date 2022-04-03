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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { faAppleWhole } from '@fortawesome/free-solid-svg-icons/faAppleWhole'
import { faCarrot } from '@fortawesome/free-solid-svg-icons/faCarrot'
import { faCheese } from '@fortawesome/free-solid-svg-icons/faCheese'
import { faLeaf } from '@fortawesome/free-solid-svg-icons/faLeaf'
import { faMedal } from '@fortawesome/free-solid-svg-icons/faMedal'

import { faBeer } from '@fortawesome/free-solid-svg-icons/faBeer'
import { faFish } from '@fortawesome/free-solid-svg-icons/faFish'
import { faDog } from '@fortawesome/free-solid-svg-icons/faDog'
import { faFrog } from '@fortawesome/free-solid-svg-icons/faFrog'
import { faHorse } from '@fortawesome/free-solid-svg-icons/faHorse'
import { faSnowman } from '@fortawesome/free-solid-svg-icons/faSnowman'
import { faPiggyBank } from '@fortawesome/free-solid-svg-icons/faPiggyBank'





const iconMap = {
  0: faAppleWhole,
  1: faCarrot,
  2: faCheese,
  3: faLeaf,
  4: faMedal,
  5: faBeer,
  6: faFish,
  7: faDog,
  8: faFrog,
  9: faHorse,
  10: faSnowman,
  11: faPiggyBank,
}


function GameView({ navigation, route }) {
  const { socket, currentRoomId } = React.useContext(SocketContext);
  const [gameState, setGameState] = useState(null);
  const [isGameFinish, setIsGameFinish] = useState(false);
  const [winner, setWinner] = useState(null);

  const { initialGameState } = route.params;
  const getGameState = () => {
    return gameState;
  };
  React.useEffect(() => {
    setGameState(initialGameState);

    socket.current.on('game state', (gameStateX) => {
      setGameState(gameStateX);
    });

    socket.current.on('finish game', (winner) => {
      setWinner(winner);
      setIsGameFinish(true);
      socket.current.disconnect();
    });
  }, []);

  React.useEffect(() => {

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
                <Text style={styles[`text${field.state}`]}>
                  {field.state !== 'hide' ? <FontAwesomeIcon style={{color: 'white', width: 50, height: 50}} icon={ iconMap[field.symbol] } /> : null}
                </Text>
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
                  <Text style={styles.textStyle}>Back to Rooms</Text>
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
    padding: '10px',
  },
  card: {
    flexBasis: '22%',
    height: '12%',
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
  },
  hide: {
    backgroundColor: '#rgb(248,95,106)',
  },
  selected: {
    backgroundColor: '#3625cc',
    color: "white"
  },
  guessed: {
    backgroundColor: '#ebde8f',
  },
  texthide: {

  },
  textselected: {
    color: "white"
  },
  textguessed: {

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
    width: "80%",
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
    backgroundColor: '#rgb(248,95,106)',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#rgb(248,95,106)',
  },
  buttonClose: {
    backgroundColor: '#rgb(248,95,106)',
    borderRadius: 5,
    padding: 10,
    marginTop: 50,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameView;
