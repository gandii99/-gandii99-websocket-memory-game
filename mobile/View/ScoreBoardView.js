import React, { useEffect, useState } from 'react';
import { Button, View, Text, StyleSheet, Pressable } from 'react-native';
import PlayerNameBox from '../Components/PlayerNameBox';

function ScoreBoardView({ navigation }) {
  const [scoreBoard, setScoreBoard] = useState([]);

  const getScoreBoard = () => {
    fetch('http://192.168.0.105:3000/scores')
      .then((response) => response.json())
      .then((data) => {
        setScoreBoard(data);
      });
  };

  useEffect(() => {
    getScoreBoard();
  }, []);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.title}>Scoreboard</Text>

      <View style={styles.rowWrapper}>
          <Text style={styles.nameText}>Name</Text>
          <Text style={styles.scoreText}>Score</Text>
      </View>

      {scoreBoard.length > 0
        ? scoreBoard.map((score) => {
            return (
              <View style={styles.rowWrapper}  key={score._id}>
                <Text style={styles.nameText}>{score.name}</Text>
                <Text style={styles.scoreText}>{score.score}</Text>
              </View>
            );
          })
        : null}
      <Pressable style={styles.button} onPress={() => navigation.navigate('MenuView')} >
        <Text style={styles.text}>Back</Text>
      </Pressable>
      <PlayerNameBox />
    </View>
  );
}

const styles = StyleSheet.create({
  rowWrapper: {
    width: '60%',
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameText: {
    color:  "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  scoreText: {
    color:  "grey",
    fontSize: 20,
  },
  title: {
    fontSize: 60,
    letterSpacing:2,
    color: "blue",
    fontWeight: "bold",
    marginBottom: 40,
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
  },
  text: {
    color: 'white',
    fontSize: 20,
  }

});

export default ScoreBoardView;
