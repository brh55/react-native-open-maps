import { createMapLink, createOpenLink } from '../.';

const options = {
	latitude: 10.02134,
	longitude: -29.21322,
	zoom: 15
}

test('Create proper links', () => {
	// Google default link
	expect(createMapLink(options)).toEqual('http://maps.google.com/maps?q=10.02134,-29.21322&z=15');
	// Google map link
	expect(createMapLink({ ...options, provider: 'google' })).toEqual('http://maps.google.com/maps?q=10.02134,-29.21322&z=15');
	// Apple map link
	expect(createMapLink({ ...options, provider: 'apple' })).toEqual('http://maps.apple.com/?sll=10.02134,-29.21322&z=15');
});

test('Create a delayed function', () => {
	const link = createOpenLink(options);
	expect(typeof link).toBe('function');
});
