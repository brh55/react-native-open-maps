import { validate } from '@babel/types';
import { beforeEach, expect, test } from '@jest/globals';
import { validateEnum } from '..';
import {
	createMapLink,
	createOpenLink,
	geoCordStringify,
	createQueryParameters,
	createAppleParams
} from '../.';

const testOptions = {
	latitude: 10.02134,
	longitude: -29.21322,
}

const appleAddress = '1 Infinite Loop, Cupertino, CA';
const googleAddress = '1600 Amphitheatre Pkwy, Mountain View, CA 94043';

afterEach(() => {
	jest.resetModules();
});

describe('Core Functionality', () => {
	test('Create a delayed function', () => {
		const link = createOpenLink({...testOptions, provider: 'google'});
		expect(typeof link).toBe('function');
	});

	test('Create a proper map link for android', () => {
		jest.mock('react-native/Libraries/Utilities/Platform', () => ({ OS: 'android'}));

		const mapLink = createMapLink({ provider: 'google', start: 'foo', end: 'bar' });
		expect(mapLink.includes('https://')).toBeTruthy();
		expect(mapLink.includes('?')).toBeTruthy();
	});

	test('Create a proper map link for ios', () => {
		jest.mock('react-native/Libraries/Utilities/Platform', () => ({ OS: 'ios'}));

		const mapLink = createMapLink({ provider: 'apple', start: 'foo', end: 'bar' });
		expect(mapLink.includes('maps://')).toBeTruthy();
		expect(mapLink.includes('?')).toBeTruthy();
	});

	test('Creates only necessary query parameters', () => {
		const baseUrl = 'https://www.google.com/maps/search/?api=1&';
		const options = {
			coords: '',
			zoom: 5,
			end: '',
			start: '',
			latitude: ''
		};
		expect(createMapLink(options)).toEqual(baseUrl + 'zoom=5');
	});

	describe('Apple Maps Links', () => {
		const provider = 'apple';
		const baseUrl = 'http://maps.apple.com/?';

		beforeEach(() => {
			jest.mock('react-native/Libraries/Utilities/Platform', () => ({}));
		});

		test('Search query', () => {
			const query = 'Yosemite National Park';
			expect(createMapLink({ provider, query })).toEqual(baseUrl + 'q=Yosemite%20National%20Park');
		});

		test('Search query near location', () => {
			const query = 'Yosemite National Park';
			const options = {
				provider, query, latitude: testOptions.latitude, longitude: testOptions.longitude
			}
			// Should supply a z parameter
			expect(createMapLink(options))
				.toEqual(baseUrl + 'll=10.02134,-29.21322&q=Yosemite%20National%20Park&z=15');

			expect(createMapLink({ ...options, zoom: 5 }))
				.toEqual(baseUrl + 'll=10.02134,-29.21322&q=Yosemite%20National%20Park&z=5');
		});

		test('Get directions from start to end', () => {
			expect(createMapLink({ provider, start: 'Cupertino', end: 'San Francisco' })).toEqual(baseUrl + 'daddr=San%20Francisco&saddr=Cupertino');
		});

		test('Get directions from here', () => {
			expect(createMapLink({ provider, end: 'San Francisco' })).toEqual(baseUrl + 'daddr=San%20Francisco');
		});

		test('Display different travel options', () => {
			const prefix = baseUrl + 'daddr=Cupertino,%20CA&dirflg=';
			expect(createMapLink({ provider, end: 'Cupertino, CA', travelType: 'drive' })).toEqual(prefix + 'd');
			expect(createMapLink({ provider, end: 'Cupertino, CA', travelType: 'walk' })).toEqual(prefix + 'w');
			expect(createMapLink({ provider, end: 'Cupertino, CA', travelType: 'public_transport' })).toEqual(prefix + 'r');
		});

		test('Display with different base map options', () => {
			const prefix = baseUrl + 'll=10.02134,-29.21322&t=';
			expect(createMapLink({ provider, ...testOptions, mapType: 'satellite' })).toEqual(prefix + 'k');
			expect(createMapLink({ provider, ...testOptions, mapType: 'standard' })).toEqual(prefix + 'm');
			expect(createMapLink({ provider, ...testOptions, mapType: 'hybrid' })).toEqual(prefix  + 'h');
			expect(createMapLink({ provider, ...testOptions, mapType: 'transit' })).toEqual(prefix  + 'r');

			// Throw if not a correct map type
			expect(() => {
				createMapLink({ provider, ...testOptions, mapType: 'foo'})
			}).toThrow();
		});

		test('Display and center map around coordinates', () => {
			expect(createMapLink({ provider, ...testOptions })).toEqual(baseUrl + 'll=10.02134,-29.21322');
		});

		test('Display map around address', () => {
			expect(createMapLink({ provider, address: appleAddress})).toEqual(baseUrl + 'address=1%20Infinite%20Loop,%20Cupertino,%20CA');
			expect(createMapLink({ provider, address: googleAddress})).toEqual(baseUrl + 'address=1600%20Amphitheatre%20Pkwy,%20Mountain%20View,%20CA%2094043');
		});
	});


	describe('Google Maps', () => {
		const provider = 'google';
		const baseUrl = 'http://maps.apple.com/?';

		test('Create a map link with correct query strings', () => {
			// Google Display Link
			expect(createMapLink(options))
				.toEqual(
					'https://www.google.com/maps/@?api=1&map_action=map&center=10.02134,-29.21322&travelmode=driving&zoom=11'
				);

			// Google map link
			expect(createMapLink({ ...options, provider: 'google', query }))
				.toEqual('https://www.google.com/maps/@?api=1&map_action=map&center=10.02134,-29.21322&travelmode=driving&zoom=11');
		});
	});

});



// const expectedQueryName = encodeURI(query);


// // Check to make sure it omits empty params
// const formattedParams2 = {
// 	query: 'New York City, New York, NY',
// 	coords: '',
// 	zoom: 5,
// 	travelType: 'walk',
// 	end: '',
// 	start: ''
// };

// // test('Create apple params', () => {
// // 	expect(
// // 		createAppleParams(formattedParams)
// // 	).toMatchObject({
// // 		z: 10,
// // 		dirflg: 'd',
// // 		ll: '11.11,22.222'
// // 	});
	
// // 	expect(
// // 		createAppleParams(formattedParams2)
// // 	)
// // 	.toMatchObject({
// // 		q: 'New York City, New York, NY',
// // 		z: 5,
// // 		dirflg: 'w',
// // 	});
// // });

// // test('Create proper query parameter mapping', () => {
// // 	const base = {
// // 		latitude: 22.22,
// // 		longitude: 11.11,
// // 		zoom: 10,
// // 		travelType: 'drive'
// // 	};

// // 	const baseExpected = {
// // 		apple: {
// // 			ll: '22.22,11.11',
// // 			z: base.zoom,
// // 			dirflg: 'd'
// // 		},
// // 		google: {
// // 			center: '22.22,11.11',
// // 			zoom: base.zoom,
// // 			travelmode: 'driving'
// // 		}
// // 	};

// // 	const googleQS = createQueryParameters('google', base);
// // 	const appleQS = createQueryParameters('apple', base);
// // 	expect(googleQS).toMatchObject(baseExpected.google);
// // 	expect(appleQS).toMatchObject(baseExpected.apple);

// // 	const directions = {
// // 		start: 'City Hall, New York City, NY',
// // 		end: 'SOHO, New York City, NY',
// // 		travelType: 'drive',
// // 	}

// // 	const directionInput = Object.assign({}, base, directions);

// // 	const expectedDirection = {
// // 		apple: {
// // 			...baseExpected.apple,
// // 			saddr: directions.start,
// // 			daddr: directions.end,
// // 			dirflg: 'd'
// // 		},
// // 		google: {
// // 			...baseExpected.google,
// // 			origin: directions.start,
// // 			destination: directions.end,
// // 			travelmode: 'driving'
// // 		}
// // 	};

// // 	const directionOuput = createQueryParameters(directionInput);
// // 	expect(directionOuput).toMatchObject(expectedDirection);
// // });


// describe('Google Maps', () => {
// 	test('Create proper links query links', () => {
// 		// Google Display Link
// 		expect(createMapLink(options))
// 			.toEqual(
// 				'https://www.google.com/maps/@?api=1&map_action=map&center=10.02134,-29.21322&travelmode=driving&zoom=11'
// 			);
	
// 		// Google map link
// 		expect(createMapLink({ ...options, provider: 'google', query }))
// 			.toEqual('https://www.google.com/maps/@?api=1&map_action=map&center=10.02134,-29.21322&travelmode=driving&zoom=11');
// 	});
// })

// describe('Yandex Maps', () => {

// });

describe('Utilities', () => {
	test('geoCordStringify: stringifies latitude and longitude', () => {
		expect(geoCordStringify(11.111,222.222)).toEqual('11.111,222.222');
		expect(() => {
			geoCordStringify(
				'hello fellow developer',
				'if you are reading this, you are a great always remember that!'
			)
		}).toThrow();
	});

	test('validateEnums: validates incorrect enumerations', () => {
		const fooBarEnumValidator = validateEnum(['foo', 'bar']);
		expect(() => fooBarEnumValidator('baz')).toThrow();
		expect(() => fooBarEnumValidator('foo')).toBeTruthy();
	});
})