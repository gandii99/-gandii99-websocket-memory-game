import * as React from 'react';
import { Button, View, Text, TextInput, StyleSheet,Pressable } from 'react-native';
import { AuthContext } from '../App';

function UserNameView({ navigation }) {
  const { setPlayerName } = React.useContext(AuthContext);
  const [inputValue, setInputValue] = React.useState('');

  const handleOnPress = () => {
    setPlayerName(inputValue);
    navigation.navigate('MenuView');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory</Text>
      <TextInput
        placeholder="nazwa"
        value={inputValue}
        onChangeText={setInputValue}
        style={styles.input}
      ></TextInput>
    <Pressable onPress={handleOnPress} style={styles.button}>
      <Text style={styles.text}>next</Text>
    </Pressable>
     
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
    color: "#3625cc",
    fontWeight: "bold"
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
  
  text: {
    color: 'white',
    fontSize: 20,
  }
})

export default UserNameView;
