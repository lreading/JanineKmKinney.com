const expect = require('chai').expect;
const sinon = require('sinon');

const crypto = require('../../../src/util/crypto.js');
const secrets = require('../../../src/util/secrets.js');

describe('util/crypto.js', () => {
	let sandbox;
	
	beforeEach(() => {
		sandbox = sinon.createSandbox();
		sandbox.stub(secrets, 'get').withArgs('CRYPTO_ROUNDS').returns(2);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('generates a hash from a plaintext string', async () => {
		const plainText = 'This is my string.  There are many like it, but this one is mine!!123';
		const hash = await crypto.encryptWithSaltAsync(plainText);
		expect(hash).not.to.eql(plainText);
	}).timeout(5000);

	it('is able to compare a hash to a plaintext value', async () => {
		const plainText = 'ASDFjkl;123#$%';
		const hash = await crypto.encryptWithSaltAsync(plainText);
		const matches = await crypto.compareHashAsync(plainText, hash);
		expect(matches).to.eql(true);
	}).timeout(5000);
});
