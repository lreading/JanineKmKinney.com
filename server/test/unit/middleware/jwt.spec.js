const expect = require('chai').expect;
const jsonwebtoken = require('jsonwebtoken');
const sinon = require('sinon');

const errors = require('../../../src/responses/error.js');
const jwt = require('../../../src/middleware/jwt.js');
const secrets = require('../../../src/util/secrets.js');

describe('middleware/jwt.js', () => {
	let sandbox;
	let forbiddenStub, badRequestStub;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		const errorMock = () => {};
		forbiddenStub = sandbox.stub(errors, 'forbidden').returns(errorMock);
		badRequestStub = sandbox.stub(errors, 'badRequest').returns(errorMock);
		sandbox.stub(secrets, 'get').returns('ASDFASDFASDFASDF');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('returns forbidden if there is no auth header', () => {
		const req = {
			headers: {}
		};
		jwt(req, {});
		expect(forbiddenStub.called).to.be.true;
	});

	it('returns forbidden with a poorly formatted auth header', () => {
		const req = {
			headers: {
				authorization: 'some unexpected condition'
			}
		};
		jwt(req, {});
		expect(badRequestStub.called).to.be.true;
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
		expect(forbiddenStub.called).to.be.true;
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
		expect(req.jwt).to.eql(obj);
	});
});
