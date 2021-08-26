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
export const createAppleParams = options => {
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

	const params = {
		ll: options.coords,
		z: options.zoom,
		dirflg: (options.travelType) ? travelTypeMap[options.travelType] : null,
		q: options.query,
		saddr: options.start,
		daddr: options.end,
		t: (options.mapType) ? baseTypeMap[options.mapType] : null
	}

	// User performing a query near a location, this requires the z parameter for apple maps
	if (options.query && options.coords && options.zoom === undefined) {
		params.z = 15;
	}

	return cleanObject(params);
}

// Create Google Maps Parameters
// doc: https://developers.google.com/maps/documentation/urls/get-started
export const createGoogleParams = options => {
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

	const params = {
		origin: options.start,
		destination: options.end,
		destination_place_id: options.endPlaceId,
		travelmode: travelTypeMap[options.travelType],
		zoom: options.zoom,
		basemap: baseTypeMap[options.mapType],
	};

	if (options.mapType === 'transit' || options.mapType === 'hybrid') {
		params.layer = 'transit';
	}

	if (options.navigate === true) {
		params.dir_action = 'navigate';
	}

	if (options.coords) {
		params.center = options.coords;
	} else {
		params.query = options.query;
		params.query_place_id = options.queryPlaceId;
	}

	return cleanObject(params);
}

// Create Yandex Maps Parameters
export const createYandexParams = options => {
	const travelTypeMap = {
	  	drive: 'auto',
	  	walk: 'pd',
	  	public_transport: 'mt'
	};

	const baseTypeMap = {
		standard: 'map',
		satellite: 'satellite',
		hybrid: 'skl',
		transit: 'map' // Yandex does not have a transit map per docs, setting to default
	}

	const params = {
	  	z: options.zoom,
	  	rtt: travelTypeMap[options.travelType],
	  	// yandex url scheme requires reversed coords
	  	ll: options.reverseCoords,
	  	pt: options.reverseCoords,
	  	oid: options.queryPlaceId,
	  	text: options.query,
		l: (options.mapType) ? baseTypeMap[options.mapType] : null
	};

	if (options.start && options.end) {
	  	params.rtext = `${options.start}~${options.end}`;
	}

	if (options.start && !options.end) {
	  	console.warn('Yandex Maps does not support current location, please specify direction\'s start and end.');
	  	params.rtext = `${options.start}`;
	}

	if (options.end && !options.start) {
  	  	console.warn('Yandex Maps does not support current location, please specify direction\'s start and end.');
	  	params.rtext = `${options.end}`;
	}

	return cleanObject(params);
  };

// Generates a query parameter for the provider specified
export const createQueryParameters = (options) => {
	if (options.travelType) {
		validateTravelType(options.travelType);
	}

	if (options.mapType) {
		validateMapType(options.mapType);
	}

	if (options.latitude && options.longitude) {
		options.coords = geoCordStringify(options.latitude, options.longitude);
		options.reverseCoords = geoCordStringify(options.longitude, options.latitude);
	}

	const generateParameters = {
		apple: createAppleParams,
		google: createGoogleParams,
		yandex: createYandexParams,
	}[options.provider];

	return generateParameters(options);
};

export default function open(options) {
	createOpenLink(options)();
}

// Returns a delayed async function that opens when executed
export function createOpenLink({ provider, ...options }) {
	const defaultProvider = (Platform.OS === 'ios') ? 'apple' : 'google';
	const mapProvider = provider || defaultProvider;

	// Allow override provider, otherwise use the default provider
	const mapLink = createMapLink({ provider: mapProvider, ...options });
	return async () => Linking.openURL(mapLink).catch(err => console.error('An error occurred', err));
}

export function createMapLink(options) {
	// All Options Defined Here
	const {
		provider = 'google',
		latitude,
		longitude,
		zoom,
		start,
		end,
		endPlaceId,
		query,
		queryPlaceId,
		navigate,
		travelType,
		mapType
	} = options;

	// Assume query is first choice
	const link = {
		google: 'https://www.google.com/maps/search/?api=1&',
		apple: (Platform.OS === 'ios') ? 'maps://?' : 'http://maps.apple.com/?',
		yandex: 'https://maps.yandex.com/?'
	};

	// Display if lat and longitude is specified
	if (latitude && longitude) {
		link.google = 'https://www.google.com/maps/@?api=1&map_action=map&';

		// If navigate is navigate with lat and lng params
		if (navigate === true) {
			console.warn("Expected 'end' parameter in navigation, defaulting to preview mode.");
			options.navigate = false;
		}
	}

	// Directions if start and end is present
	if (options.end) {
		link.google = 'https://www.google.com/maps/dir/?api=1&';
	}

	const mapQueryParams = createQueryParameters({...options, provider});
	// Escaped commas cause unusual error with Google map
    return link[provider] + queryString.stringify(mapQueryParams).replace(/%2C/g, ',');
}
