const fs = require('fs');

const secrets = require('../../../src/util/secrets.js');

describe('util/secrets.js', () => {
	describe('process.env', () => {
		const oldEnv = process.env;

		beforeEach(() => {
			jest.resetModules();
			process.env = { ...oldEnv };
			delete process.env.NODE_ENV;
		});
    
		afterEach(() => {
			process.env = oldEnv;
		});
    
		it('gets a process env variable as a secret', () => {
			const name = 'SOMESECRET';
			const val = 'test';
			process.env[name] = val;
    
			expect(secrets.get(name)).toEqual(val);
		});
    
		it('does not return an error when there is no secret', () => {
			expect(secrets.get('fake')).toEqual('');
		});
    
		it('returns nothing with an invalid name', () => {
			const name = 'ASDF%^&*';
			const val = 'test';
			process.env[name] = val;
    
			expect(secrets.get(name)).toEqual('');
		});
	});

	describe('docker secrets', () => {
		const name = 'SOME_SECRET';
		const val = 'test';

		beforeEach(() => {
			jest.resetModules();
			jest.spyOn(fs, 'existsSync');
			fs.existsSync.mockReturnValue(true);
			jest.spyOn(fs, 'readFileSync');
			fs.readFileSync.mockReturnValue(val);
		});

		it('gets a secret from docker secrets', () => {
			expect(secrets.get(name)).toEqual(val);
		});
    
		it('prefers docker secrets over node environment variables', () => {
			process.env[name] = 'BAD_VAL';
			expect(secrets.get(name)).toEqual(val);
		});
	});
});