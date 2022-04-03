import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../App';

function GameView() {
  const { playerName } = React.useContext(AuthContext);
  return <Text style={styles.text}>Logged as: {playerName}</Text>;
}

const styles = StyleSheet.create({ 
  text: {
    marginTop: 20,
    fontSize: 20,
    color: 'grey',
  }
})

export default GameView;
