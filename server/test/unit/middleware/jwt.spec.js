const jsonwebtoken = require('jsonwebtoken');

const errors = require('../../../src/responses/error.js');
const jwt = require('../../../src/middleware/jwt.js');
const secrets = require('../../../src/util/secrets.js');

describe('middleware/jwt.js', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		const errorMock = () => {};
		jest.spyOn(errors, 'forbidden');
		jest.spyOn(errors, 'badRequest');
		errors.forbidden.mockImplementation(errorMock);
		errors.badRequest.mockImplementation(errorMock);
	});

	it('returns forbidden if there is no auth header', () => {
		const req = {
			headers: {}
		};
		jwt(req, {});
		expect(errors.forbidden).toHaveBeenCalledTimes(1);
	});

	it('returns forbidden with a poorly formatted auth header', () => {
		const req = {
			headers: {
				authorization: 'some unexpected condition'
			}
		};
		jwt(req, {});
		expect(errors.badRequest).toHaveBeenCalledTimes(1);
	});

	it('returns forbidden with an invalid JWT', () => {
		const obj = { foo: 'bar' };
		const token = jsonwebtoken.sign(JSON.stringify(obj), 'bad key');
		const req = {
			headers: {
				authorization: `Bearer ${token}`
			}
		};
		jwt(req, {});
		expect(errors.forbidden).toHaveBeenCalledTimes(1);
	});

	it('adds the JWT to the request object if successfully authenticated', () => {
		const obj = { foo: 'bar' };
		const token = jsonwebtoken.sign(JSON.stringify(obj), secrets.get('JWT_SECRET_KEY'));
		const req = {
			headers: {
				authorization: `Bearer ${token}`
			}
		};
		jwt(req, {});
		expect(req.jwt).toEqual(obj);
	});
});
