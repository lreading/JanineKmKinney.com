const fs = require('fs');

const expect = require('chai').expect;
const sinon = require('sinon');

const secrets = require('../../../src/util/secrets.js');

describe('util/secrets.js', () => {
	let sandbox;
	beforeEach(() => {
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('process.env', () => {
		const oldEnv = process.env;

		beforeEach(() => {
			process.env = { ...oldEnv };
			delete process.env.NODE_ENV;
		});
    
		it('gets a process env variable as a secret', () => {
			const name = 'SOMESECRET';
			const val = 'test';
			process.env[name] = val;
    
			expect(secrets.get(name)).to.eql(val);
		});
    
		it('does not return an error when there is no secret', () => {
			expect(secrets.get('fake')).to.eql('');
		});
    
		it('returns nothing with an invalid name', () => {
			const name = 'ASDF%^&*';
			const val = 'test';
			process.env[name] = val;
    
			expect(secrets.get(name)).to.eql('');
		});
	});

	describe('docker secrets', () => {
		const name = 'SOME_SECRET';
		const val = 'test';

		beforeEach(() => {
			sandbox.stub(fs, 'existsSync').returns(true);
			sandbox.stub(fs, 'readFileSync').returns(val);
		});

		it('gets a secret from docker secrets', () => {
			expect(secrets.get(name)).to.eql(val);
		});
    
		it('prefers docker secrets over node environment variables', () => {
			process.env[name] = 'BAD_VAL';
			expect(secrets.get(name)).to.eql(val);
		});
	});
});