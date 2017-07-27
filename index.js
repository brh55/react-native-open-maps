import React from 'react';
import { Linking, Platform } from 'react-native';

export default function ({latitude, longitude, zoomLevel = 15}, open = true) {
	// Default to Google maps unless on IOs
	let mapUrl = `http://maps.google.com/maps?q=${latitude},${longitude}&z=${zoomLevel}`;

	if (Platform.OS === 'ios') {
      mapUrl = `http://maps.apple.com/?sll=${latitude},${longitude}&z=${zoomLevel}`;
    }

	if (open) {
		// Returns a function that opens when executed
		return () => Linking.openURL(mapUrl).catch(err => console.error('An error occurred', err));
	} else {
		// Returns the generated mapUrl
		return mapUrl;
	}
}
