const request = require('supertest');

const utils = require('../utils.js');

describe('users endpoint', () => {
    it('creates a new user', async () => {
        const res = await request(utils.baseUrl)
            .post('/users')
            .send({
                username: utils.getRandomUsername(12)
            })
            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('id')
            expect(res.body).toHaveProperty('username');
    });
});
