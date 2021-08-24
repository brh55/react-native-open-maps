/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity
} from 'react-native';

import {
  createOpenLink
} from './localTest';

const DemoContent = (): Node => {
  const start = 'SOHO, New York City, NY';
	const end = 'Chinatown, New York City, NY';
	const travelType = 'public_transport';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Travel The</Text>
        <Text style={styles.headerSubTitle}>World!</Text>
        <Text style={styles.emojis}>💪🏼🏔🌲</Text>
      </View>
      <View style={styles.sectionMain}>
        <Text style={styles.mapTitle}>Apple Maps</Text>
        <View style={styles.mapButtonCard}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={createOpenLink({ latitude: 37.865101, longitude: -119.538330, query: 'Yosemite Trails', zoom: 0 })}>
            <Text style={styles.mapButtonText}>🏞 Open Yosemite</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={createOpenLink({ start, end, zoom: 20})}>
            <Text style={styles.mapButtonText}>🚙 Directions (SOHO - Chinatown)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={createOpenLink({ travelType, end })}>
            <Text style={styles.mapButtonText}>🚎 Directions w/ Transit (Here - Chinatown)</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.mapTitle}>Google Maps</Text>
        <View style={styles.mapButtonCard}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={createOpenLink({ latitude: 37.865101, longitude: -119.538330, provider: 'google', zoom: 10 })}>
            <Text style={styles.mapButtonText}>🏞 Display Yosemite</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={createOpenLink({ travelType, start, end, provider: 'google' })}>
            <Text style={styles.mapButtonText}>🚙 Directions (SOHO - Chinatown)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={createOpenLink({ travelType, end, provider: 'google' })}>
            <Text style={styles.mapButtonText}>🚎 Directions w/ Transit (Here - Chinatown)</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.mapTitle}>Yandex Maps</Text>
        <View style={styles.mapButtonCard}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={createOpenLink({ provider: 'yandex', latitude: 53.882847, longitude: 27.727503, zoom: 12, travelType })}>
            <Text style={styles.mapButtonText}>🏙 Display Minsk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={createOpenLink({ provider: 'yandex', start, end, travelType })}>
            <Text style={styles.mapButtonText}>🚙 Directions (SOHO - Chinatown)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={createOpenLink({ provider: 'yandex', query: 'Cafe', zoom: 15 })}>
            <Text style={styles.mapButtonText}>☕️ Find the nearest cafe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const App: () => Node = () => {
  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
          <DemoContent/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  header: {
    padding: 30,
    width: '100%',
    flex: 1,
    paddingBottom: 0,
    backgroundColor: '#151515'
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: '400',
    color: 'white'
  },
  headerSubTitle: {
    fontSize: 50,
    fontWeight: '900',
    color: 'white'
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2a2830',
    marginBottom: 10,
    marginTop: 13
  },
  mapOpenButton: {
    backgroundColor: '#f8f8fa',
    fontWeight: '800'
  },
  mapButton: {
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#e4e4e4'
  },
  mapButtonText: {
    fontWeight: '500'
  },
  emojis: {
    fontSize: 35,
    marginBottom: 10,
    alignSelf: 'flex-end'
  },
  coordinates: {
    fontSize: 14,
    fontWeight: '500',
    color: '#bdc3c7'
  },
  sectionMain: {
    padding: 30,
    paddingTop: 20
  }
});

export default App;
