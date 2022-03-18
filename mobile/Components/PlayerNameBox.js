import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { AuthContext } from '../App';

function GameView() {
  const { playerName } = React.useContext(AuthContext);
  return <Text>currentPlayer: {playerName}</Text>;
}

export default GameView;
