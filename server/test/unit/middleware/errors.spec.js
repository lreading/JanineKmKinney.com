const expect = require('chai').expect;
const sinon = require('sinon');

const errors = require('../../../src/middleware/errors.js');

describe('middleware/errors.js', () => {
	const res = {
		status: () => { return res; },
		json: () => {}
	};
	let sandbox;
	let statusSpy, jsonSpy;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		statusSpy = sandbox.spy(res, 'status');
		jsonSpy = sandbox.stub(res, 'json');
		errors('Test', {}, res);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('returns a 500 status code', () => {
		expect(statusSpy.calledWith(500)).to.be.true;
	});

	it('gives a generic error message', () => {
		expect(jsonSpy.calledWith({
			success: false,
			status: 500,
			message: 'Internal Server Error'
		})).to.be.true;
	});
});
