import { Linking, Platform } from 'react-native';
import queryString from 'query-string';

// Stringifies the latitude and longitude into coordinates
export const geoCordStringify = (latitude, longitude) => {
	[latitude, longitude].map(coord => {
		if (typeof coord !== 'number') {
			throw new Error('Entered a non-number value for geo coordinates.');
		}
	});

	return `${latitude},${longitude}`;
}

// Creates a validator for an array
export const validateEnum = (enums = []) => (type) => {
	if (enums.indexOf(type) === -1) {
		throw new Error(`Received ${type}, expected ${enums}`);
	}
	return true;
}

export const validateTravelType = validateEnum(['drive', 'walk', 'public_transport']);
export const validateMapType = validateEnum(['standard', 'satellite', 'hybrid', 'transit']);

// cleanObject :: {} -> {}
// Creates a new object that removes any empty values
const cleanObject = input => {
	return Object.keys(input).reduce((acc, key) => {
		const currentValue = input[key];
		return (currentValue) ?
			Object.assign({}, acc, { [key]: currentValue }) : acc;
	}, {});
}

// Create Apple Maps Parameters
// doc: https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
export const createAppleParams = params => {
	const travelTypeMap = {
		drive: 'd',
		walk: 'w',
		public_transport: 'r'
	};

	const baseTypeMap = {
		satellite: 'k',
		standard: 'm',
		hybrid: 'h',
		transit: 'r',
	}

	const map = {
		ll: params.coords,
		z: params.zoom,
		dirflg: (params.travelType) ? travelTypeMap[params.travelType] : null,
		q: params.query,
		saddr: params.start,
		daddr: params.end,
		t: baseTypeMap[params.mapType] || baseTypeMap['standard']
	}

	return cleanObject(map);
}

// Create Google Maps Parameters
// doc: https://developers.google.com/maps/documentation/urls/get-started
export const createGoogleParams = params => {
	const travelTypeMap = {
		drive: 'driving',
		walk: 'walking',
		public_transport: 'transit'
	};

	const baseTypeMap = {
		satellite: 'satellite',
		standard: 'roadmap',
		hybrid: 'satellite',
		transit: 'roadmap'
	}

	const map = {
		origin: params.start,
		destination: params.end,
		destination_place_id: params.endPlaceId,
		travelmode: travelTypeMap[params.travelType],
		zoom: params.zoom,
		basemap: baseTypeMap[params.mapType],
	};

	if (params.mapType === 'transit' || params.mapType === 'hybrid') {
		map.layer = 'transit';
	}

	if (params.navigate === true) {
		map.dir_action = 'navigate';
	}

	if (params.coords) {
		map.center = params.coords;
	} else {
		map.query = params.query;
		map.query_place_id = params.queryPlaceId;
	}

	return cleanObject(map);
}

// Create Yandex Maps Parameters
export const createYandexParams = params => {
	const travelTypeMap = {
	  	drive: 'auto',
	  	walk: 'pd',
	  	public_transport: 'mt'
	};

	const baseTypeMap = {
		standard: 'map',
		satellite: 'satellite',
		hybrid: 'skl'
	}

	const map = {
	  	z: params.zoom,
	  	rtt: travelTypeMap[params.travelType],
	  	// yandex url scheme requires reversed coords
	  	ll: params.reverseCoords,
	  	pt: params.reverseCoords,
	  	oid: params.queryPlaceId,
	  	text: params.query,
		l: baseTypeMap[params.mapType] || baseTypeMap['standard']
	};

	if (params.start && params.end) {
	  	map.rtext = `${params.start}~${params.end}`;
	}

	if (params.start && !params.end) {
	  	console.warn('Yandex Maps does not support current location, please specify direction\'s start and end.');
	  	map.rtext = `${params.start}`;
	}

	if (params.end && !params.start) {
  	  	console.warn('Yandex Maps does not support current location, please specify direction\'s start and end.');
	  	map.rtext = `${params.end}`;
	}

	return cleanObject(map);
  };

// The map portion API is defined here essentially
export const createQueryParameters = (provider, {
	latitude,
	longitude,
	zoom,
	start,
	end,
	endPlaceId,
	query,
	queryPlaceId,
	navigate = false,
	travelType,
	mapType
}) => {
	if (travelType) {
		validateTravelType(travelType);
	}

	if (mapType) {
		validateMapType(mapType);
	}

	const formatArguments = {
		start,
		end,
		endPlaceId,
		query,
		queryPlaceId,
		navigate,
		travelType,
		zoom
	}

	if (latitude && longitude) {
		formatArguments.coords = geoCordStringify(latitude, longitude);
		formatArguments.reverseCoords = geoCordStringify(longitude, latitude);
	}

	const generateParameters = {
		apple: createAppleParams,
		google: createGoogleParams,
		yandex: createYandexParams,
	}[provider];

	return generateParameters(formatArguments);
};

export default function open(params) {
	createOpenLink(params)();
}

// Returns a delayed async function that opens when executed
export function createOpenLink({ provider, ...params }) {
	const defaultProvider = (Platform.OS === 'ios') ? 'apple' : 'google';
	const mapProvider = provider || defaultProvider;

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
		apple: (Platform.OS === 'ios') ? 'maps://?' : 'http://maps.apple.com/?',
		yandex: 'https://maps.yandex.com/?'
	};

	// Display if lat and longitude is specified
	if (params.latitude && params.longitude) {
		link.google = 'https://www.google.com/maps/@?api=1&map_action=map&';

		// if navigate is navigate with lat and lng params
		if (params.navigate === true) {
			console.warn("Expected 'end' parameter in navigation, defaulting to preview mode.");
			params.navigate = false;
		}
	}

	// Directions if start and end is present
	if (params.end) {
		link.google = 'https://www.google.com/maps/dir/?api=1&';
	}

	const queryParameters = createQueryParameters(provider, params);
	// Escaped commas cause unusual error with Google map
    return link[provider] + queryString.stringify(queryParameters).replace(/%2C/g, ',');
}
