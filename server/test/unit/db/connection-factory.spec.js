const factory = require('../../../src/db/connection-factory.js');

describe('db/connection-factory.js', () => {
	afterEach(() => {
		factory.disconnect();
	});

	it('has an undefined pool object before connecting', () => {
		expect(factory.get()).not.toBeDefined();
	});

	it('creates the pool object after connect', () => {
		factory.connect();
		expect(factory.get()).toBeDefined();
	});
});