const expect = require('chai').expect;
const jsonwebtoken = require('jsonwebtoken');
const sinon = require('sinon');

const jwt = require('../../../src/service/jwt.js');
const secrets = require('../../../src/util/secrets.js');

describe('service/jwt.js', () => {
	let sandbox;
	let secretStub;
	let token;
	const user = {
		id: 23,
		username: 'testuser'
	};

	beforeEach(async () => {
		sandbox = sinon.createSandbox();
		secretStub = sandbox.stub(secrets, 'get');
		secretStub.withArgs('JWT_SECRET_KEY').returns('JIBBERISH');
		secretStub.withArgs('JWT_EXPIRATION').returns('1h');
		
		token = await jwt.createJwtAsync(user);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('generates a new key as a string', async () => {
		expect(token).to.be.a('string');
		expect(token).to.have.length.greaterThan(1);
	});

	describe('getValidatedToken', () => {
		it('gets the decoded JWT', () => {
			const decoded = jwt.getValidatedToken(token);
			expect(decoded.user).to.eql(user);
		});

		it('fails validation with a bad secret', () => {
			const badTokenString = jsonwebtoken.sign(JSON.stringify(user), 'bad key');
			const decoded = jwt.getValidatedToken(badTokenString);
			expect(decoded).to.be.null;
		});

		it('fails validation if the token has been tampered with', () => {
			const tokenParts = token.split('.');
			const bodyJson = Buffer.from(tokenParts[1], 'base64').toString('utf8');
			const body = JSON.parse(bodyJson);
			body.username = 'whoops';
			const newBodyString = Buffer.from(JSON.stringify(body)).toString('base64');
			const newToken = `${tokenParts[0]}.${newBodyString}.${tokenParts[2]}`;

			const decoded = jwt.getValidatedToken(newToken);
			expect(decoded).to.be.null;
		});

		it('fails validation if the token is expired', async () => {
			secretStub.withArgs('JWT_EXPIRATION').returns('15ms');
			const shortToken = await jwt.createJwtAsync(user);
			const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
			await sleep(20);

			const decoded = jwt.getValidatedToken(shortToken);
			expect(decoded).to.be.null;
		});
	});
});
