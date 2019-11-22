const expect = require('chai').expect;

const loggerLib = require('../../../src/util/logger.js');

describe('util/logger', () => {
	let logger;

	beforeEach(() => {
		logger = loggerLib.child({ label: 'test' });
	});

	it('defines an error level', () => {
		expect(logger.error).to.be.a('function');
	});

	it('defines an audit level', () => {
		expect(logger.audit).to.be.a('function');
	});

	it('defines an warn level', () => {
		expect(logger.warn).to.be.a('function');
	});

	it('defines an info level', () => {
		expect(logger.info).to.be.a('function');
	});

	it('defines an debug level', () => {
		expect(logger.debug).to.be.a('function');
	});

	it('defines an verbose level', () => {
		expect(logger.verbose).to.be.a('function');
	});

	it('defines an silly level', () => {
		expect(logger.silly).to.be.a('function');
	});

	it('does not define a foobar level', () => {
		expect(logger.foobar).to.be.undefined;
	});
});