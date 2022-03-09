import * as React from 'react';
import { Button, View, Text, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function UserNameView({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Memory</Text>
      <TextInput placeholder="nazwa"></TextInput>
      <Button title="Dalej" onPress={() => navigation.navigate('MenuView')} />
    </View>
  );
}

export default UserNameView;
