const expect = require('chai').expect;
const request = require('supertest');

const utils = require('../utils.js');

describe('users endpoint', () => {
	// No guarantee that this will not be in the HIBP DB... Unlikely that we'd get a match though
	const validPass = utils.getRandomUsername(10) + 'R2%$#';

	it('creates a new user', async () => {
		const res = await request(utils.baseUrl)
			.post('/users')
			.send({
				username: utils.getRandomUsername(12),
				password: validPass
			});
		expect(res.statusCode).to.eql(200);
		expect(res.body).to.have.property('id');
		expect(res.body).to.have.property('username');
	});

	it('returns a 400 if no body is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/users');
		expect(res.statusCode).to.eql(400);
		expect(res.body.message).to.match(/user/);
	});

	it('returns a 400 if no username is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/users')
			.send({
				password: validPass
			});
		expect(res.statusCode).to.eql(400);
		expect(res.body.message).to.match(/username/);
	});

	it('returns a 400 if an invalid password is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/users')
			.send({
				username: utils.getRandomUsername(12),
				password: 'blah'
			});
		expect(res.statusCode).to.eql(400);
		expect(res.body.message).to.match(/Passwords/);
	});

	it('returns a 400 if trying to create a user that exists', async () => {
		const username = utils.getRandomUsername(12);
		await request(utils.baseUrl)
			.post('/users')
			.send({
				username: username,
				password: validPass
			});
		
		const res = await request(utils.baseUrl)
			.post('/users')
			.send({
				username: username, 
				password: validPass
			});
		expect(res.statusCode).to.eql(400);
		expect(res.body.message).to.eql('Username unavailable.');
	});

	it('returns a 400 if using a pwned password', async () => {
		const res = await request(utils.baseUrl)
			.post('/users')
			.send({
				username: utils.getRandomUsername(12),
				password: 'Password123!' // pwned password
			});
		expect(res.statusCode).to.eql(400);
		expect(res.body.message).to.match(/Passwords/);
	});

	describe('users/get', () => {
		const username = utils.getRandomUsername(12);
		let token;

		before(async () => {
			await utils.createUserAsync(username, validPass);
		});

		beforeEach(async () => {
			token = (await utils.loginAsync(username, validPass)).token;
		});

		it('requires authentication to get a user', async () => {
			const res = await request(utils.baseUrl)
				.get('/users/1');

			expect(res.statusCode).to.eql(403);
		});
	
		it('gets a valid user', async () => {
			const res = await request(utils.baseUrl)
				.get('/users/1')
				.set('Authorization', `Bearer ${token}`);
			expect(res.statusCode).to.eql(200);
			expect(res.body.id).to.eql(1);
			expect(res.body.username.length).to.be.greaterThan(1);
		});
	
		it('returns a 404 when no user is found', async () => {
			const res = await request(utils.baseUrl)
				.get('/users/999999999')
				.set('Authorization', `Bearer ${token}`);

			expect(res.statusCode).to.eql(404);
		});
	});
});
