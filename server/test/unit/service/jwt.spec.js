const jsonwebtoken = require('jsonwebtoken');

const jwt = require('../../../src/service/jwt.js');

describe('service/jwt.js', () => {
	const user = {
		id: 23,
		username: 'testuser'
	};

	describe('createJwtAsync', () => {
		it('generates a new key as a string', async () => {
			const token = await jwt.createJwtAsync(user);
			expect(typeof token).toEqual('string');
			expect(token.length).toBeGreaterThan(1);
		});
	});

	describe('getValidatedToken', () => {
		let token;
		beforeEach(async () => {
			token = await jwt.createJwtAsync(user);
		});
        
		it('gets the decoded JWT', () => {
			const decoded = jwt.getValidatedToken(token);
			expect(decoded.user).toEqual(user);
		});

		it('fails validation with a bad secret', () => {
			const badTokenString = jsonwebtoken.sign(JSON.stringify(user), 'bad key');
			const decoded = jwt.getValidatedToken(badTokenString);
			expect(decoded).toBeNull();
		});

		it('fails validation if the token has been tampered with', () => {
			const tokenParts = token.split('.');
			const bodyJson = Buffer.from(tokenParts[1], 'base64').toString('utf8');
			const body = JSON.parse(bodyJson);
			body.username = 'whoops';
			const newBodyString = Buffer.from(JSON.stringify(body)).toString('base64');
			const newToken = `${tokenParts[0]}.${newBodyString}.${tokenParts[2]}`;

			const decoded = jwt.getValidatedToken(newToken);
			expect(decoded).toBeNull();
		});

		it('fails validation if the token is expired', async () => {
			process.env.JWT_EXPIRATION = '50ms';
			const shortToken = await jwt.createJwtAsync(user);
			const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
			await sleep(75);

			const decoded = jwt.getValidatedToken(shortToken);
			expect(decoded).toBeNull();
			process.env.JWT_EXPIRATION = '12h';
		});
	});
});
