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
		z: params.zoom,
		dirflg: travelTypeMap[params.travelType],
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
		origin: params.start,
		destination: params.end,
		travelmode: travelTypeMap[params.travelType],
		zoom: params.zoom
	};

	if (params.navigate_mode === 'navigate') {
		map.dir_action = 'navigate'
	}

	if (params.coords) {
		map.center = params.coords;
	} else {
		map.query = params.query;
	}

	return cleanObject(map);
}

// The map portion API is defined here essentially
export const createQueryParameters = ({
	latitude,
	longitude,
	zoom = 15,
	start = '',
	end = '',
	query = '',
	navigate_mode = 'preview', // preview has always being the default mode
	travelType = 'drive'
}) => {
	validateTravelType(travelType);

	const formatArguments = {
		start,
		end,
		query,
		navigate_mode,
		travelType,
		zoom
	}
	
	if (latitude && longitude) {
		formatArguments.coords = geoCordStringify(latitude, longitude);
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
	// Assume query is first choice
	const link = {
		google: 'https://www.google.com/maps/search/?api=1&',
		apple: 'http://maps.apple.com/?'
	};
	
	// Display if lat and longitude is specified
	if (params.latitude && params.longitude) {
		link.google = 'https://www.google.com/maps/@?api=1&map_action=map&';

		// if navigate_mode is navigate with latlng params
		if (params.navigate_mode === 'navigate') {
			console.warn("navigate_mode='navigate' only supports 'end' prop")
			params['navigate_mode'] = 'preview';
		}
	}

	// Directions if start and end is present
	if (params.end) {
		link.google = 'https://www.google.com/maps/dir/?api=1&';
	}

	// throw an error to the developer
	if (params.start && params.navigate_mode === 'navigate') {
		console.warn("navigate_mode='navigate' only supports 'end' prop")
	}

	const queryParameters = createQueryParameters(params);
	// Escaped commas cause unusual error with Google map
	const appleQs = queryString.stringify(queryParameters.apple).replace(/%2C/g, ',');
	const googleQs = queryString.stringify(queryParameters.google).replace(/%2C/g, ',');

	link.google += googleQs;
	link.apple  += appleQs;

	return link[provider];
}
