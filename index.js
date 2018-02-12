import React from 'react';
import { Linking, Platform } from 'react-native';

export default function open({latitude, longitude, zoomLevel, provider}) {
	// Execute link
	createOpenLink({latitude, longitude, zoomLevel, provider})();
}

export function createOpenLink({latitude, longitude, zoomLevel = 15, provider}) {
	if (!provider) {
		defaultProvider = (Platform.OS === 'ios') ? 'apple' : 'google';
	}

	const mapProvider = provider || defaultProvider;
	// Allow override provider, otherwise use the default provider
	const mapLink = createMapLink({latitude, longitude, zoomLevel, provider:  mapProvider});

	// Returns a delayed function that opens when executed
	return () => Linking.openURL(mapLink).catch(err => console.error('An error occurred', err));
}

export function createMapLink({latitude, longitude, zoomLevel = 15, provider = 'google'}) {
	const link = {
		'google': `http://maps.google.com/maps?q=${latitude},${longitude}&z=${zoomLevel}`,
		'apple': `http://maps.apple.com/?q=${latitude},${longitude}&z=${zoomLevel}`
	};

	return link[provider];
}
