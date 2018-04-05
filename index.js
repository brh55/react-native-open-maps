import React from 'react';
import { Linking, Platform } from 'react-native';

export default function open({latitude, longitude, zoomLevel, name, provider}) {
	// Execute link
	createOpenLink({latitude, longitude, zoomLevel, name, provider})();
}

export function createOpenLink({latitude, longitude, zoomLevel = 15, name, provider}) {
	if (!provider) {
		defaultProvider = (Platform.OS === 'ios') ? 'apple' : 'google';
	}

	const mapProvider = provider || defaultProvider;
	// Allow override provider, otherwise use the default provider
	const mapLink = createMapLink({latitude, longitude, zoomLevel, name, provider:  mapProvider});

	// Returns a delayed function that opens when executed
	return () => Linking.openURL(mapLink).catch(err => console.error('An error occurred', err));
}

export function createMapLink({latitude, longitude, zoomLevel = 15, name = 'Pin', provider = 'google'}) {
	let pinname = encodeURI(name);
	const link = {
		'google': `http://maps.google.com/maps?ll=${latitude},${longitude}&z=${zoomLevel}&q=${pinname}`,
		'apple': `http://maps.apple.com/?ll=${latitude},${longitude}&z=${zoomLevel}&q=${pinname}`
	};

	return link[provider];
}
