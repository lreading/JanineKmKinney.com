const request = require('supertest');

const utils = require('../utils.js');

describe('users endpoint', () => {
	const validPass = 'Sup3rS3cure!';

	it('creates a new user', async () => {
		const res = await request(utils.baseUrl)
			.post('/users')
			.send({
				username: utils.getRandomUsername(12),
				password: validPass
			});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('id');
		expect(res.body).toHaveProperty('username');
	});

	it('returns a 400 if no body is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/users');
		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toContain('user');
	});

	it('returns a 400 if no username is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/users')
			.send({
				password: validPass
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toContain('username');

	});

	it('returns a 400 if an invalid password is provided', async () => {

		const res = await request(utils.baseUrl)
			.post('/users')
			.send({
				username: utils.getRandomUsername(12),
				password: 'blah'
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toContain('Passwords');
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
		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toEqual('Username unavailable.');
	});

	describe('users/get', () => {
		const username = utils.getRandomUsername(12);
		let token;

		beforeAll(async () => {
			await utils.createUserAsync(username, validPass);
		});

		beforeEach(async () => {
			token = (await utils.loginAsync(username, validPass)).token;
		});

		it('requires authentication to get a user', async () => {
			const res = await request(utils.baseUrl)
				.get('/users/1');

			expect(res.statusCode).toEqual(403);
		});
	
		it('gets a valid user', async () => {
			const res = await request(utils.baseUrl)
				.get('/users/1')
				.set('Authorization', `Bearer ${token}`);
			expect(res.statusCode).toEqual(200);
			expect(res.body.id).toEqual(1);
			expect(res.body.username.length).toBeGreaterThan(1);
		});
	
		it('returns a 404 when no user is found', async () => {
			const res = await request(utils.baseUrl)
				.get('/users/999999999')
				.set('Authorization', `Bearer ${token}`);

			expect(res.statusCode).toEqual(404);
		});
	});
});
