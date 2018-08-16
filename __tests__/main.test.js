import { 
	createMapLink,
	createOpenLink,
	geoCordStringify,
	createQueryParameters,
	createAppleParams
} from '../.';

const query = 'Yosemite National Park';
const expectedQueryName = encodeURI(query);

const options = {
	latitude: 10.02134,
	longitude: -29.21322,
	zoom: 15,
}

test('Stringify geocoordinates', () => {
	expect(geoCordStringify(11.111,222.222)).toEqual('11.111,222.222');
	expect(() => {
		geoCordStringify(
			'hello fellow developer',
			'if you are reading this, you are a great always remember that!'
		)
	}).toThrow();
});

const formattedParams = {
	coords: '11.11,22.222',
	zoomLevel: 10,
	travelType: 'drive'
};

// Check to make sure it omits empty params
const formattedParams2 = {
	query: 'New%20York%20City',
	coords: '',
	zoomLevel: 5,
	travelType: 'walk',
	end: '',
	start: ''
};

test('Create apple params', () => {
	expect(
		createAppleParams(formattedParams)
	).toMatchObject({
		z: 10,
		dirflag: 'd',
		ll: '11.11,22.222'
	});
	
	expect(
		createAppleParams(formattedParams2)
	)
	.toMatchObject({
		q: 'New%20York%20City',
		z: 5,
		dirflag: 'w',
	});
});

test('Create proper cross-platform query parameters', () => {
	const base = {
		latitude: 22.22,
		longitude: 11.11,
		zoomLevel: 10,
		travelType: 'drive'
	};

	const baseExpected = {
		apple: {
			ll: '22.22,11.11',
			z: base.zoomLevel,
			dirflag: 'd'
		},
		google: {
			query: '22.22,11.11',
			zoom: base.zoomLevel,
			travelmode: 'driving'
		}
	};

	const actualOutput = createQueryParameters(base);
	expect(actualOutput.google).toMatchObject(baseExpected.google);
	expect(actualOutput.apple).toMatchObject(baseExpected.apple);

	const directions = {
		start: 'City Hall, New York City, NY',
		end: 'SOHO, New York City, NY',
		travelType: 'drive',
	}

	const directionInput = Object.assign({}, base, directions);
	const escapeStart = encodeURI(directions.start);
	const escapeEnd = encodeURI(directions.end);

	const expectedDirection = {
		apple: {
			...baseExpected.apple,
			saddr: escapeStart,
			daddr: escapeEnd,
			dirflag: 'd'
		},
		google: {
			...baseExpected.google,
			origin: escapeStart,
			destination: escapeEnd,
			travelmode: 'driving'
		}
	};

	const directionOuput = createQueryParameters(directionInput);
	expect(directionOuput).toMatchObject(expectedDirection);
});

test('Create proper links', () => {
	// Google default link
	expect(createMapLink(options)).toEqual(`https://www.google.com/maps/search/?api=1&zoom=15&query=10.02134,-29.21322`);
	// Google map link
	expect(createMapLink({ ...options, provider: 'google', query })).toEqual(`https://www.google.com/maps/search/?api=1&zoom=15&query=${expectedQueryName}`);
	// Apple map link
	expect(createMapLink({ ...options, provider: 'apple', query })).toEqual(`http://maps.apple.com/?ll=10.02134,-29.21322&z=15&q=${expectedQueryName}`);
});

test('Create a cross-compatible origin direction link', () => {
	const appleLink = createMapLink({
		...options,

	})
});

test('Create a delayed function', () => {
	const link = createOpenLink({...options, provider: 'google'});
	expect(typeof link).toBe('function');
});
