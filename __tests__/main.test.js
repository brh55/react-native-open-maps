import { createMapLink, createOpenLink } from '../.';

const query = 'Yosemite National Park';
const expectedQueryName = encodeURI(query);

const options = {
	latitude: 10.02134,
	longitude: -29.21322,
	zoom: 15,
	query
}

test('Create proper links', () => {
	// Google default link
	expect(createMapLink(options)).toEqual(`https://www.google.com/maps/search/?api=1&zoom=15&q=${expectedQueryName}`);
	// Google map link
	expect(createMapLink({ ...options, provider: 'google' })).toEqual(`https://www.google.com/maps/search/?api=1&zoom=15&q=${expectedQueryName}`);
	// Apple map link
	expect(createMapLink({ ...options, provider: 'apple' })).toEqual(`http://maps.apple.com/?ll=10.02134,-29.21322&z=15&q=${expectedQueryName}`);
});

test('Create a delayed function', () => {
	const link = createOpenLink({...options, provider: 'google'});
	expect(typeof link).toBe('function');
});
