const errors = require('../../../src/middleware/errors.js');

describe('middleware/errors.js', () => {
	const res = {
		status: () => { return res; },
		json: () => {}
	};

	beforeEach(() => {
		jest.spyOn(res, 'status');
		jest.spyOn(res, 'json');
		errors('Test', {}, res);
	});

	it('returns a 500 status code', () => {
		expect(res.status).toHaveBeenCalledWith(500);
	});

	it('gives a generic error message', () => {
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			status: 500,
			message: 'Internal Server Error'
		});
	});
});
