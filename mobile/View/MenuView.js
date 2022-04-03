import * as React from 'react';
import { Button, View, Text, StyleSheet, Pressable } from 'react-native';
import PlayerNameBox from '../Components/PlayerNameBox';

function MenuView({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory</Text>
      <Pressable
        style={[styles.button]}
        onPress={() => navigation.navigate('RoomView')}
      >
        <Text style={styles.text}>Multiplayer</Text>
      </Pressable>
      <Pressable
 style={[styles.button ,styles.accentButton]}
        onPress={() => navigation.navigate('ScoreBoardView')}
      >
        <Text style={styles.text}>Scoreboard</Text>
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
    marginBottom: 40,
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
    width: 200,
    height: 44,
    padding: 8,
    backgroundColor: '#rgb(248,95,106)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  accentButton: {
    backgroundColor: '#3625cc',
  },
  text: {
    color: 'white',
    fontSize: 20,
  }
})

export default MenuView;
