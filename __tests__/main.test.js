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
	zoom: 11,
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
	zoom: 10,
	travelType: 'drive'
};

// Check to make sure it omits empty params
const formattedParams2 = {
	query: 'New York City, New York, NY',
	coords: '',
	zoom: 5,
	travelType: 'walk',
	end: '',
	start: ''
};

test('Create apple params', () => {
	expect(
		createAppleParams(formattedParams)
	).toMatchObject({
		z: 10,
		dirflg: 'd',
		ll: '11.11,22.222'
	});
	
	expect(
		createAppleParams(formattedParams2)
	)
	.toMatchObject({
		q: 'New York City, New York, NY',
		z: 5,
		dirflg: 'w',
	});
});

test('Create proper query parameter mapping', () => {
	const base = {
		latitude: 22.22,
		longitude: 11.11,
		zoom: 10,
		travelType: 'drive'
	};

	const baseExpected = {
		apple: {
			ll: '22.22,11.11',
			z: base.zoom,
			dirflg: 'd'
		},
		google: {
			center: '22.22,11.11',
			zoom: base.zoom,
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
			dirflg: 'd'
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
	// Google Display Link
	expect(createMapLink(options))
		.toEqual(
			"https://www.google.com/maps/@?api=1&map_action=map&center=10.02134,-29.21322&travelmode=driving&zoom=11"
		);

	// Google map link
	expect(createMapLink({ ...options, provider: 'google', query }))
		.toEqual("https://www.google.com/maps/@?api=1&map_action=map&center=10.02134,-29.21322&travelmode=driving&zoom=11");
	
	// Apple map link
	expect(createMapLink({ ...options, provider: 'apple', query }))
		.toEqual("http://maps.apple.com/?dirflg=d&ll=10.02134,-29.21322&q=Yosemite%20National%20Park&z=11");
});

test('Create proper direction links', () => {
	const start = 'New York City, New York, NY';
	const end = 'SOHO, New York, NY';

	// Apple
	expect(createMapLink({ provider: 'apple', start, end }))
		.toEqual("http://maps.apple.com/?daddr=SOHO,%20New%20York,%20NY&dirflg=d&saddr=New%20York%20City,%20New%20York,%20NY&z=15");

	// Google
	expect(createMapLink({ provider: 'google', start, end }))
		.toEqual("https://www.google.com/maps/dir/?api=1&destination=SOHO,%20New%20York,%20NY&origin=New%20York%20City,%20New%20York,%20NY&travelmode=driving&zoom=15");
});

test('Create a delayed function', () => {
	const link = createOpenLink({...options, provider: 'google'});
	expect(typeof link).toBe('function');
});
