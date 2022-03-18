import * as React from 'react';
import { Button, View, Text, TextInput } from 'react-native';
import { AuthContext } from '../App';

function UserNameView({ navigation }) {
  const { setPlayerName } = React.useContext(AuthContext);
  const [inputValue, setInputValue] = React.useState('');

  const handleOnPress = () => {
    setPlayerName(inputValue);
    navigation.navigate('MenuView');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Memory</Text>
      <TextInput
        placeholder="nazwa"
        value={inputValue}
        onChangeText={setInputValue}
      ></TextInput>
      <Button title="Dalej" onPress={handleOnPress} />
    </View>
  );
}

export default UserNameView;
