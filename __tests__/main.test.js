import { validate } from '@babel/types';
import { beforeEach, describe, expect, test } from '@jest/globals';
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

const genOptions = (provider, options) => ({ ...options, provider});

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

	describe('Maps Links', () => {
		const provider = 'apple';
		const url = {
			apple: 'http://maps.apple.com/?',
			yandex: 'https://maps.yandex.com/?',
			google: {
				search: 'https://www.google.com/maps/search/?api=1&',
				directions: 'https://www.google.com/maps/dir/?api=1&',
				display: 'https://www.google.com/maps/@?api=1&map_action=map&'
			}
		};

		beforeEach(() => {
			jest.mock('react-native/Libraries/Utilities/Platform', () => ({}));
		});

		describe('Search query', () => {
			const query = 'Yosemite National Park';

			test('Apple Maps', () => {
				expect(createMapLink({ provider: 'apple', query })).toEqual(url.apple + 'q=Yosemite%20National%20Park');
			});
			
			test('Google Maps', () => {
				expect(createMapLink({ provider: 'google', query })).toEqual(url.google.search + 'query=Yosemite%20National%20Park');
			});

			test('Yandex Maps', () => {
				expect(createMapLink({ provider: 'yandex', query })).toEqual(url.yandex + 'text=Yosemite%20National%20Park');
			});
		});

		describe('Search query near location', () => {
			const query = 'Yosemite National Park';
			const options = {
				provider, query, ...testOptions
			}

			test('Apple Maps', () => {
				// Should supply a z parameter
				expect(createMapLink(options))
					.toEqual(url.apple + 'll=10.02134,-29.21322&q=Yosemite%20National%20Park&z=15');

				expect(createMapLink({ ...options, zoom: 5 }))
					.toEqual(url.apple + 'll=10.02134,-29.21322&q=Yosemite%20National%20Park&z=5');
			})

			test('Google Maps', () => {
				expect(createMapLink(genOptions('google', options)))
					.toEqual(url.google.display + 'center=10.02134,-29.21322');
			})

			test('Yandex Maps', () => {
				const provider = 'yandex';
				expect(createMapLink(genOptions('yandex', options)))
					.toEqual(url.yandex + 'll=-29.21322,10.02134&pt=-29.21322,10.02134&text=Yosemite%20National%20Park');
			})
		});

		describe('Get directions from start to end', () => {
			const start = 'Cupertino';
			const end = 'San Francisco';
			test('Apple Maps', () => {
				expect(createMapLink({ provider, start, end })).toEqual(url.apple + 'daddr=San%20Francisco&saddr=Cupertino');
			});

			test('Google Maps', () => {
				const provider = 'google';
				expect(createMapLink({ provider, start, end })).toEqual(url.google.directions + 'destination=San%20Francisco&origin=Cupertino');
			});

			test('Yandex Maps', () => {
				const provider = 'yandex';
				expect(createMapLink({ provider, start, end })).toEqual(url.yandex + 'rtext=Cupertino~San%20Francisco');
			});
		});

		describe('Get directions with waypoints', () => {
			const start = 'Cupertino';
			const end = 'San Francisco';
			const waypoints = ['San Jose, California', 'Campbell, California'];

			test('Apple Maps', () => {
				expect(createMapLink({ provider, start, end, waypoints })).toEqual(url.apple + 'daddr=San%20Jose,%20California&daddr=Campbell,%20California&daddr=San%20Francisco&saddr=Cupertino');
			});

			test('Google Maps', () => {
				const provider = 'google';
				expect(createMapLink({ provider, start, end, waypoints })).toEqual(url.google.directions + 'destination=San%20Francisco&origin=Cupertino&waypoints=San%20Jose,%20California|Campbell,%20California');
			});

			test('Yandex Maps', () => {
				const provider = 'yandex';
				expect(createMapLink({ provider, start, end, waypoints })).toEqual(url.yandex + 'rtext=Cupertino~San%20Francisco');
			});

		});

		describe('Get directions from here', () => {
			const end = 'San Francisco';
			test('Apple Maps', () => {
				expect(createMapLink({ provider, end })).toEqual(url.apple + 'daddr=San%20Francisco');
			});

			test('Google Maps', () => {
				const provider = 'google';
				expect(createMapLink({ provider, end })).toEqual(url.google.directions + 'destination=San%20Francisco');
			});

			test('Yandex Maps', () => {
				const provider = 'yandex';
				expect(createMapLink({ provider, end })).toEqual(url.yandex + 'rtext=San%20Francisco');
			});
		});

		describe('Directions for different travel options', () => {
			const end = 'Cupertino, CA';
			const drive = { end, travelType: 'drive' };
			const walk = { end, travelType: 'walk' };
			const publicTransportation = { end, travelType: 'public_transport' };

			test('Apple Maps', () => {
				const prefix = url.apple + 'daddr=Cupertino,%20CA&dirflg=';
				expect(createMapLink(genOptions('apple', drive))).toEqual(prefix + 'd');
				expect(createMapLink(genOptions('apple', walk))).toEqual(prefix + 'w');
				expect(createMapLink(genOptions('apple', publicTransportation))).toEqual(prefix + 'r');
			});
			
			test('Google Maps', () => {
				const prefix = url.google.directions + 'destination=Cupertino,%20CA&travelmode=';
				expect(createMapLink(genOptions('google', drive))).toEqual(prefix + 'driving');
				expect(createMapLink(genOptions('google', walk))).toEqual(prefix + 'walking');
				expect(createMapLink(genOptions('google', publicTransportation))).toEqual(prefix + 'transit');
			});

			test('Yandex Maps', () => {
				const prefix = url.yandex + 'rtext=Cupertino,%20CA&rtt=';
				expect(createMapLink(genOptions('yandex', drive))).toEqual(prefix + 'auto');
				expect(createMapLink(genOptions('yandex', walk))).toEqual(prefix + 'pd');
				expect(createMapLink(genOptions('yandex', publicTransportation))).toEqual(prefix + 'mt');
			});
		});

		describe('Display with different base map options', () => {
			const satellite = { ...testOptions, mapType: 'satellite' };
			const hybrid = { ...testOptions, mapType: 'hybrid' };
			const transit = { ...testOptions, mapType: 'transit' };
			const standard = { ...testOptions, mapType: 'standard' };

			test('Apple Maps', () => {
				const prefix = url.apple + 'll=10.02134,-29.21322&t=';

				expect(createMapLink(genOptions('apple', satellite))).toEqual(prefix + 'k');
				expect(createMapLink(genOptions('apple', standard))).toEqual(prefix + 'm');
				expect(createMapLink(genOptions('apple', hybrid))).toEqual(prefix  + 'h');
				expect(createMapLink(genOptions('apple', transit))).toEqual(prefix  + 'r');	
			});


			test('Google Maps', () => {
				const createUrl = (base) => `${url.google.display}basemap=${base}&center=10.02134,-29.21322`;

				expect(createMapLink(genOptions('google', satellite))).toEqual(createUrl('satellite'));
				expect(createMapLink(genOptions('google', standard))).toEqual(createUrl('roadmap'));
				expect(createMapLink(genOptions('google', hybrid))).toEqual(createUrl('satellite') + '&layer=transit');
				expect(createMapLink(genOptions('google', transit))).toEqual(createUrl('roadmap')  + '&layer=transit');	
			});

			test('Yandex Maps', () => {
				const createUrl = (base) => `${url.yandex}l=${base}&ll=-29.21322,10.02134&pt=-29.21322,10.02134`;

				expect(createMapLink(genOptions('yandex', satellite))).toEqual(createUrl('satellite'));
				expect(createMapLink(genOptions('yandex', standard))).toEqual(createUrl('map'));
				expect(createMapLink(genOptions('yandex', hybrid))).toEqual(createUrl('skl'));
				expect(createMapLink(genOptions('yandex', transit))).toEqual(createUrl('map'));
			});

			test('Incorrect Map Type', () => {
				expect(() => {
					createMapLink({ provider, ...testOptions, mapType: 'foo'})
				}).toThrow();
			})
		});

		describe('Display and center map around coordinates', () => {
			test('Apple Maps', () => {
				expect(createMapLink(genOptions('apple', testOptions))).toEqual(url.apple + 'll=10.02134,-29.21322');
			});

			test('Google Maps', () => {
				expect(createMapLink(genOptions('google', testOptions))).toEqual(url.google.display + 'center=10.02134,-29.21322');
			});

			test('Yandex Maps', () => {
				expect(createMapLink(genOptions('yandex', testOptions))).toEqual(url.yandex + 'll=-29.21322,10.02134&pt=-29.21322,10.02134');
			});
		});

		describe('Display map around address', () => {
			const appleAddress = '1 Infinite Loop, Cupertino, CA';
			const googleAddress = '1600 Amphitheatre Pkwy, Mountain View, CA 94043';

			const address1 = { end: appleAddress };
			const address2 = { end: googleAddress };

			test('Apple Maps', () => {
				expect(createMapLink(genOptions('apple', address1))).toEqual(url.apple + 'daddr=1%20Infinite%20Loop,%20Cupertino,%20CA');
				expect(createMapLink(genOptions('apple', address2))).toEqual(url.apple + 'daddr=1600%20Amphitheatre%20Pkwy,%20Mountain%20View,%20CA%2094043');
			});

			test('Google Maps', () => {
				expect(createMapLink(genOptions('google', address1))).toEqual(url.google.directions + 'destination=1%20Infinite%20Loop,%20Cupertino,%20CA');
				expect(createMapLink(genOptions('google', address2))).toEqual(url.google.directions + 'destination=1600%20Amphitheatre%20Pkwy,%20Mountain%20View,%20CA%2094043');
			});

			test('Yandex Maps', () => {
				expect(createMapLink(genOptions('yandex', address1))).toEqual(url.yandex + 'rtext=1%20Infinite%20Loop,%20Cupertino,%20CA');
				expect(createMapLink(genOptions('yandex', address2))).toEqual(url.yandex + 'rtext=1600%20Amphitheatre%20Pkwy,%20Mountain%20View,%20CA%2094043');
			});
		});

	});

});

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
