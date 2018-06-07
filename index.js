import React from 'react';
import { Linking, Platform } from 'react-native';

export default function open({latitude, longitude, zoomLevel, name, provider}) {
	// Execute link
	createOpenLink({latitude, longitude, zoomLevel, name, provider})();
}

export function createOpenLink({latitude, longitude, zoomLevel = 15, name, provider}) {
	// Returns a delayed async function that opens when executed
	return async () => {
		if (!provider) {
			defaultProvider = (Platform.OS === 'ios') ? 'apple' : 'google';
		}
	
		let mapProvider = provider || defaultProvider;
		if (provider === 'google' && Platform.OS === 'ios') {
			const supported = await Linking.canOpenURL('comgooglemaps://?center=40.765819,-73.975866&zoom=14&views=traffic');
			mapProvider = 'googleDeepLink';
		}
		// Allow override provider, otherwise use the default provider
		const mapLink = createMapLink({latitude, longitude, zoomLevel, name, provider: mapProvider});
	
		Linking.openURL(mapLink).catch(err => console.error('An error occurred', err));
	}
}

export function createMapLink({latitude, longitude, zoomLevel = 15, query, provider = 'google'}) {
	const link = {
		'google': `http://maps.google.com/maps?ll=${latitude},${longitude}&z=${zoomLevel}`,
		'apple': `http://maps.apple.com/?ll=${latitude},${longitude}&z=${zoomLevel}`,
		'googleDeepLink': `comgooglemaps://?center=${latitude},${longitude}&zoom=${zoomLevel}`,
	};

	if (query) {
		const queryParam = `q=${encodeURI(query)}`;
		link.google = link.google.concat('&', queryParam);
		link.apple = link.apple.concat('&', queryParam);
	}

	return link[provider];
}
