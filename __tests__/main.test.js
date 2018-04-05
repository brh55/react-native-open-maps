import { createMapLink, createOpenLink } from '../.';

const options = {
	latitude: 10.02134,
	longitude: -29.21322,
	zoom: 15,
	name: 'pin name'
}

test('Create proper links', () => {
	// Google default link
	expect(createMapLink(options)).toEqual('http://maps.google.com/maps?ll=10.02134,-29.21322&z=15&q=pin%20name');
	// Google map link
	expect(createMapLink({ ...options, provider: 'google' })).toEqual('http://maps.google.com/maps?ll=10.02134,-29.21322&z=15&q=pin%20name');
	// Apple map link
	expect(createMapLink({ ...options, provider: 'apple' })).toEqual('http://maps.apple.com/?ll=10.02134,-29.21322&z=15&q=pin%20name');
});

test('Create a delayed function', () => {
	const link = createOpenLink(options);
	expect(typeof link).toBe('function');
});
