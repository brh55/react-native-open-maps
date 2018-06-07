import React from 'react';
import { Linking, Platform } from 'react-native';

export default function open({latitude, longitude, zoomLevel, name, provider}) {
	// Execute link
	createOpenLink({latitude, longitude, zoomLevel, name, provider})();
}

export function createOpenLink({latitude, longitude, zoomLevel = 15, query, provider}) {
	// Returns a delayed async function that opens when executed
	if (!provider) {
		defaultProvider = (Platform.OS === 'ios') ? 'apple' : 'google';
	}

	let mapProvider = provider || defaultProvider;
	// Allow override provider, otherwise use the default provider
	const mapLink = createMapLink({latitude, longitude, zoomLevel, query, provider: mapProvider});
	console.log(mapLink);
	return async () => Linking.openURL(mapLink).catch(err => console.error('An error occurred', err));
}

export function createMapLink({latitude, longitude, zoomLevel = 15, query, provider = 'google'}) {
	const link = {
		'google': `https://www.google.com/maps/search/?api=1zoom=${zoomLevel}`,
		'apple': `http://maps.apple.com/?ll=${latitude},${longitude}&z=${zoomLevel}`,
	};

	if (query) {
		const queryParam = `q=${encodeURI(query)}`;
		link.google = link.google.concat('&', queryParam);
		link.apple = link.apple.concat('&', queryParam);
	} else {
		link.google = link.google.concat('&', `q=${latitude}%2C${longitude}`)
	}

	return link[provider];
}
