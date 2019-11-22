const expect = require('chai').expect;
const request = require('supertest');

const utils = require('../utils.js');

describe('token endpoint', () => {
	const username = utils.getRandomUsername(10);
	const password = 'Sup3rS3cure!';
    
	before(async () => {
		await utils.createUserAsync(username, password);
	});

	it('gets a valid JWT', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.send(utils.getLoginBody(username, password));
            
		expect(res.statusCode).to.eql(200);
		expect(res.body.success).to.be.true;
		expect(res.body).to.have.property('token');
	});
    
	it('only accepts a form-urlencoded body', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.send({
				username,
				password
			});
		expect(res.statusCode).to.eql(400);
		expect(res.body.success).to.be.false;
		expect(res.body.message.indexOf('x-www-form-urlencoded')).not.to.eql(-1);
	});

	it('returns a 400 if no body is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.send();
		expect(res.statusCode).to.eql(400);
	});

	it('returns an error if no username is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.send('password=' + password);
		expect(res.statusCode).to.eql(400);
		expect(res.body.message.indexOf('username and password')).not.to.eql(-1);
	});

	it('returns an error if no password is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.send('username=' + password);
		expect(res.statusCode).to.eql(400);
		expect(res.body.message.indexOf('username and password')).not.to.eql(-1);
	});

	it('returns a 400 when an invalid username is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.send(utils.getLoginBody(username + 'fake', password));
            
		expect(res.statusCode).to.eql(400);
		expect(res.body.success).to.be.false;
		expect(res.body.message).to.eql('Invalid Username or Password');
	});

	it('returns a 400 when an invalid password is provided', async () => {
		const res = await request(utils.baseUrl)
			.post('/token')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.send(utils.getLoginBody(username, password + 'fake'));
            
		expect(res.statusCode).to.eql(400);
		expect(res.body.success).to.be.false;
		expect(res.body.message).to.eql('Invalid Username or Password');
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
		expect(res.statusCode).to.eql(400);
		expect(res.body.message.indexOf('User is locked out')).not.to.eql(-1);
	});
});
