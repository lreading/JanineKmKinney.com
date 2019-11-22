const expect = require('chai').expect;
const sinon = require('sinon');

const headers = require('../../../src/middleware/headers.js');

describe('middleware/errors', () => {
	const res = {
		set: () => {}
	};
	let sandbox;
	let setStub;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		setStub = sandbox.stub(res, 'set');
		headers({}, res);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('adds a x-frame-options header', () => {
		expect(setStub.calledWith('X-Frame-Options', 'SAMEORIGIN')).to.be.true;
	});

	it('adds a x-xss-protection header', () => {
		expect(setStub.calledWith('X-XSS-Protection', '1; mode=block')).to.be.true;
	});

	it('adds a x-content-type-options header', () => {
		expect(setStub.calledWith('X-Content-Type-Options', 'nosniff')).to.be.true;
	});

	it('updates the x-powered-by header', () => {
		expect(setStub.calledWith('X-Powered-By', 'Janine KM Kinney')).to.be.true;
	});
});
