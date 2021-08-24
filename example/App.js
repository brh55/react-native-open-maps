import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Button
} from 'react-native';

import { createOpenLink } from './tester';

export default class example extends Component {
  render() {
	const start = 'SOHO, New York City, NY';
	const end = 'Chinatown, New York City, NY';
	const travelType = 'public_transport';

    return (
	  <View style={styles.container}>
    	<Text style={styles.header}>Travel The World!</Text>
      <Text style={styles.emojis}>💪🏼🏔🌲</Text>
	  <Text style={styles.header}>Apple Maps</Text>
      <Button
        color={'#bdc3c7'}
        onPress={createOpenLink({ latitude: 37.865101, longitude: -119.538330, query: 'Yosemite Trails', zoom: 0 })}
        title="Open Yosemite" />
      <Button
        color={'#bdc3c7'}
        onPress={createOpenLink({ start, end, zoom: 20})}
        title="Directions (SOHO - Chinatown)" />
	 <Button
        color={'#bdc3c7'}
        onPress={createOpenLink({ travelType, end })}
        title="Directions (Here - Chinatown)" />
	<Text style={styles.header}>Google Maps</Text>
      <Button
        color={'#bdc3c7'}
        onPress={createOpenLink({ latitude: 37.865101, longitude: -119.538330, provider: 'google', zoom: 10 })}
        title="Display Yosemite" />
	 <Button
        color={'#bdc3c7'}
        onPress={createOpenLink({ travelType, start, end, provider: 'google' })}
        title="Directions (SOHO - Chinatown)" />
	<Button
        color={'#bdc3c7'}
        onPress={createOpenLink({ travelType, end, provider: 'google' })}
        title="Directions (Here - Chinatown)" />
	<Text style={styles.header}>Yandex Maps</Text>
      <Button
        color={'#bdc3c7'}
        onPress={createOpenLink({ provider: 'yandex', latitude: 53.882847, longitude: 27.727503, zoom: 12, travelType })}
        title="Display Minsk" />
      <Button
        color={'#bdc3c7'}
        onPress={createOpenLink({ provider: 'yandex', start, end, travelType })}
        title="Directions (SOHO - Chinatown)" />
      <Button
        color={'#bdc3c7'}
        onPress={createOpenLink({ provider: 'yandex', query: 'Cafe', zoom: 15 })}
        title="Find the nearest cafe" />
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
