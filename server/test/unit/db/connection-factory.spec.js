const expect = require('chai').expect;
const factory = require('../../../src/db/connection-factory.js');

describe('db/connection-factory.js', () => {
	afterEach(() => {
		factory.disconnect();
	});

	it('tests mocha', () => {
		expect(true).to.equal(true);
	});

	it('has an undefined pool object before connecting', () => {
		expect(factory.get()).to.be.undefined;
	});

	it('creates the pool object after connect', () => {
		factory.connect();
		expect(factory.get()).to.be.a('object');
	});
});