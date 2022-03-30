import React, { useEffect, useState } from 'react';
import { Button, View, Text } from 'react-native';
import PlayerNameBox from '../Components/PlayerNameBox';

function ScoreBoardView({ navigation }) {
  const [scoreBoard, setScoreBoard] = useState([]);

  const getScoreBoard = () => {
    fetch('http://192.168.1.113:3000/scores')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setScoreBoard(data);
      });
  };

  useEffect(() => {
    getScoreBoard();
  }, []);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {scoreBoard.length > 0
        ? scoreBoard.map((score) => {
            return (
              <Text key={score._id}>{score.name + ' | ' + score.score}</Text>
            );
          })
        : null}
      <Button title="Back" onPress={() => navigation.navigate('MenuView')} />
      <PlayerNameBox />
    </View>
  );
}

export default ScoreBoardView;
