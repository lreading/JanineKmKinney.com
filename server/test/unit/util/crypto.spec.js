const crypto = require('../../../src/util/crypto.js');

describe('util/crypto.js', () => {
	it('generates a hash from a plaintext string', async () => {
		const plainText = 'This is my string.  There are many like it, but this one is mine!!123';
		const hash = await crypto.encryptWithSaltAsync(plainText);
		expect(hash).not.toEqual(plainText);
	});

	it('is able to compare a hash to a plaintext value', async () => {
		const plainText = 'ASDFjkl;123#$%';
		const hash = await crypto.encryptWithSaltAsync(plainText);
		const matches = await crypto.compareHashAsync(plainText, hash);
		expect(matches).toEqual(true);
	});
});
