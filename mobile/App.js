import { StatusBar } from 'expo-status-bar';
import {
  Button,
  TouchableOpacity,
  Platform,
  TextInput,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { Component } from 'react';
import io from 'socket.io-client';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: '',
      chatMessages: [],
      name: '',
    };
  }

  componentDidMount() {
    this.socket = io('http://192.168.1.111:3000');
    this.socket.on('chat message', (msg) => {
      this.setState({ chatMessages: [...this.state.chatMessages, msg] });
    });
  }

  submitChatMessage() {
    this.socket.emit('chat message', this.state.chatMessage);
    this.setState({ chatMessage: '' });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Room1"
          onPress={() =>
            this.socket.emit('join room', 'room1', this.state.name)
          }
        ></Button>
        <Button
          title="Room2"
          onPress={() =>
            this.socket.emit('join room', 'room2', this.state.name)
          }
        ></Button>

        <TextInput
          value={this.state.name}
          onChangeText={(e) => {
            this.setState({ name: e });
          }}
        ></TextInput>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
