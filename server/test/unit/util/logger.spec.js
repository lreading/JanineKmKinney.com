const loggerLib = require('../../../src/util/logger.js');

describe('util/logger', () => {
	let logger;

	beforeEach(() => {
		logger = loggerLib.child({ label: 'test' });
	});

	it('defines an error level', () => {
		expect(logger.error).toBeDefined();
	});

	it('defines an audit level', () => {
		expect(logger.audit).toBeDefined();
	});

	it('defines an warn level', () => {
		expect(logger.warn).toBeDefined();
	});

	it('defines an info level', () => {
		expect(logger.info).toBeDefined();
	});

	it('defines an debug level', () => {
		expect(logger.debug).toBeDefined();
	});

	it('defines an verbose level', () => {
		expect(logger.verbose).toBeDefined();
	});

	it('defines an silly level', () => {
		expect(logger.silly).toBeDefined();
	});

	it('does not define a foobar level', () => {
		expect(logger.foobar).not.toBeDefined();
	});
});