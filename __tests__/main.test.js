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
	query: 'New York City, New York, NY',
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
		q: 'New York City, New York, NY',
		z: 5,
		dirflag: 'w',
	});
});

test('Create proper query parameter mapping', () => {
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

	const expectedDirection = {
		apple: {
			...baseExpected.apple,
			saddr: directions.start,
			daddr: directions.end,
			dirflag: 'd'
		},
		google: {
			...baseExpected.google,
			origin: directions.start,
			destination: directions.end,
			travelmode: 'driving'
		}
	};

	const directionOuput = createQueryParameters(directionInput);
	expect(directionOuput).toMatchObject(expectedDirection);
});

test('Create proper links query links', () => {
	// Google default link
	expect(createMapLink(options))
		.toEqual(
			"https://www.google.com/maps/search/?api=1&query=10.02134,-29.21322&travelmode=driving&zoom=15"
		);

	// Google map link
	expect(createMapLink({ ...options, provider: 'google', query }))
		.toEqual("https://www.google.com/maps/search/?api=1&query=10.02134,-29.21322&travelmode=driving&zoom=15");
	
	// Apple map link
	expect(createMapLink({ ...options, provider: 'apple', query }))
		.toEqual("http://maps.apple.com/?dirflag=d&ll=10.02134,-29.21322&q=Yosemite%20National%20Park&z=15");
});

test('Create proper direction links', () => {
	const start = 'New York City, New York, NY';
	const end = 'SOHO, New York, NY';

	// Apple
	expect(createMapLink({ ...options, provider: 'apple', start, end }))
		.toEqual("http://maps.apple.com/?daddr=SOHO,%20New%20York,%20NY&dirflag=d&ll=10.02134,-29.21322&saddr=New%20York%20City,%20New%20York,%20NY&z=15");

	// Google
	expect(createMapLink({ ...options, provider: 'google', start, end }))
		.toEqual("https://www.google.com/maps/dir/?api=1&destination=SOHO,%20New%20York,%20NY&origin=New%20York%20City,%20New%20York,%20NY&query=10.02134,-29.21322&travelmode=driving&zoom=15");
});

test('Create a delayed function', () => {
	const link = createOpenLink({...options, provider: 'google'});
	expect(typeof link).toBe('function');
});
