import React from 'react';
import { Linking, Platform } from 'react-native';
import queryString from 'query-string';

export const geoCordStringify = (latitude, longitude) => {
	[latitude, longitude].map(coord => {
		if (typeof coord !== 'number') {
			throw new Error('Entered a non-number value for geo coordinates.');
		}
	});

	return `${latitude},${longitude}`;
}

export const validateTravelType = type => {
	// Google supports "biking", omitted for sake of compatability and user expectations
	const TRAVEL_TYPE_ENUM = ['drive', 'walk', 'public_transport'];
	const validType = TRAVEL_TYPE_ENUM.filter(validType => validType === type);
	if (!validType) {
		throw new Error(`Recieved ${type}, expected ${TRAVEL_TYPE_ENUM}`);
	}
}

// cleanObject :: {} -> {}
// Creates a new object that removes any empty values
const cleanObject = input => {
	return Object.keys(input).reduce((acc, key, index,)=> {
		const currentValue = input[key];
		return (currentValue) ?
			Object.assign({}, acc, { [key]: currentValue }) : acc;
	}, {});
}

// Create apple parameters
export const createAppleParams = params => {
	const travelTypeMap = {
		drive: 'd',
		walk: 'w',
		public_transport: 'r'
	};

	const map = {
		ll: params.coords,
		z: params.zoomLevel,
		dirflag: travelTypeMap[params.travelType],
		q: params.query,
		saddr: params.start,
		daddr: params.end
	}

	return cleanObject(map);
}

// Create google parameters
export const createGoogleParams = params => {
	const travelTypeMap = {
		drive: 'driving',
		walk: 'walking',
		public_transport: 'transit'
	};

	const map = {
		query: params.coords,
		origin: params.start,
		destination: params.end,
		travelmode: travelTypeMap[params.travelType],
		zoom: params.zoomLevel
	};

	return cleanObject(map);
}

// The map portion API is defined here essentially
export const createQueryParameters = ({
	latitude = 0,
	longitude = 0,
	zoomLevel = 15,
	start = '',
	end = '',
	query = '',
	travelType = 'drive'
}) => {
	validateTravelType(travelType);

	const formatArguments = {
		coords: geoCordStringify(latitude, longitude),
		start: encodeURI(start),
		end: encodeURI(end),
		query: encodeURI(query),
		travelType,
		zoomLevel
	}

	return {
		apple: createAppleParams(formatArguments),
		google: createGoogleParams(formatArguments)
	}
};

export default function open(params) {
	createOpenLink(params)();
}

export function createOpenLink({ provider, ...params }) {
	// Returns a delayed async function that opens when executed
	if (!provider) {
		defaultProvider = (Platform.OS === 'ios') ? 'apple' : 'google';
	}

	let mapProvider = provider || defaultProvider;
	// Allow override provider, otherwise use the default provider
	const mapLink = createMapLink({ provider: mapProvider, ...params });
	return async () => Linking.openURL(mapLink).catch(err => console.error('An error occurred', err));
}

export function createMapLink({
	provider = 'google',
	...params
}) {
	const queryParameters = createQueryParameters(params);
	const appleQs = queryString.stringify(queryParameters.apple);
	const googleQs = queryString.stringify(queryParameters.google);
	const link = {
		google: 'https://www.google.com/maps/search/?api=1',
		apple: 'http://maps.apple.com/?'
	};

	if (params.start && params.end) {
		link.google = 'https://www.google.com/maps/dir/?api=1';
	}

	link.google += googleQs;
	link.apple  += appleQs;

	return encodeURI(link[provider]);
	// const link = {
	// 	'google': `https://www.google.com/maps/search/?api=1&zoom=${zoomLevel}`,
	// 	'apple': `http://maps.apple.com/?ll=${geoCordinates}&z=${zoomLevel}`,
	// };

	// if (query) {
	// 	link.google = link.google.concat(`&query=${query}`);
	// 	link.apple = link.apple.concat(`&q=${query}`);
	// } else {
	// 	link.google = link.google.concat(`&query=${geoCordinates}`);
	// }

	// return encodeURI(link[provider]);
}
