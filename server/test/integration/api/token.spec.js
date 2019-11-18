const request = require('supertest');

const utils = require('../utils.js');

describe('token endpoint', () => {
	const username = utils.getRandomUsername(10);
	const password = 'Sup3rS3cure!';
    
	beforeAll(async () => {
		await utils.createUserAsync(username, password);
		jest.setTimeout(10000);
	});

	afterAll(() => {
		jest.setTimeout(5000);
	});

	it('gets a valid JWT', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.send(utils.getLoginBody(username, password));
            
		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toEqual(true);
		expect(res.body).toHaveProperty('token');
	});
    
	it('only accepts a form-urlencoded body', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.send({
				username,
				password
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.success).toEqual(false);
		expect(res.body.message.indexOf('x-www-form-urlencoded')).not.toEqual(-1);
	});

	it('returns a 400 if no body is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.send();
		expect(res.statusCode).toEqual(400);
	});

	it('returns an error if no username is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.send('password=' + password);
		expect(res.statusCode).toEqual(400);
		expect(res.body.message.indexOf('username and password')).not.toEqual(-1);
	});

	it('returns an error if no password is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.send('username=' + password);
		expect(res.statusCode).toEqual(400);
		expect(res.body.message.indexOf('username and password')).not.toEqual(-1);
	});

	it('returns a 400 when an invalid username is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.send(utils.getLoginBody(username + 'fake', password));
            
		expect(res.statusCode).toEqual(400);
		expect(res.body.success).toEqual(false);
		expect(res.body.message).toEqual('Invalid Username or Password');
	});

	it('returns a 400 when an invalid password is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.send(utils.getLoginBody(username, password + 'fake'));
            
		expect(res.statusCode).toEqual(400);
		expect(res.body.success).toEqual(false);
		expect(res.body.message).toEqual('Invalid Username or Password');
	});

	it('locks out a user after multiple failed login attempts', async () => {
		const user = utils.getRandomUsername(12);
		await utils.createUserAsync(user, password);
		for (let i = 0; i < 6; i++) {
			await utils.loginAsync(user, password + 'fake');
		}

		const res = await request(utils.baseUrl)
			.post('/token')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.send(utils.getLoginBody(user, password));
		expect(res.statusCode).toEqual(400);
		expect(res.body.message.indexOf('User is locked out')).not.toEqual(-1);
	});
});
