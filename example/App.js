import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Button
} from 'react-native';

import link from 'react-native-open-maps';

export default class example extends Component {
  render() {
    return (
	  <View style={styles.container}>
    	<Text style={styles.header}>Let's Go to Yosemite</Text>
      <Text style={styles.emojis}>💪🏼🏔🌲</Text>
      <Text style={styles.coordinates}>37.865101° N, -119.538330° W</Text>
      <Button
        color={'#bdc3c7'}
        onPress={link({ latitude: 37.865101, longitude: -119.538330 })}
        title="Click To Open Maps 🗺" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2980b9',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ecf0f1'
  },
  emojis: {
    fontSize: 40,
    marginBottom: 10
  },
  coordinates: {
    fontSize: 14,
    fontWeight: '500',
    color: '#bdc3c7'
  }
});
