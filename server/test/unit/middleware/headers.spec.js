const headers = require('../../../src/middleware/headers.js');

describe('middleware/errors', () => {
	const res = {
		set: () => {}
	};

	beforeEach(() => {
		jest.spyOn(res, 'set');
		headers({}, res);
	});

	it('adds a x-frame-options header', () => {
		expect(res.set).toHaveBeenCalledWith('X-Frame-Options', 'SAMEORIGIN');
	});

	it('adds a x-xss-protection header', () => {
		expect(res.set).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
	});

	it('adds a x-content-type-options header', () => {
		expect(res.set).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
	});

	it('updates the x-powered-by header', () => {
		expect(res.set).toHaveBeenCalledWith('X-Powered-By', 'Janine KM Kinney');
	});
});
