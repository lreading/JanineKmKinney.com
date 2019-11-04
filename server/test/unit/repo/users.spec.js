const users = require('../../../src/repo/users.js');
const repo = require('../../../src/repo/repo.js');
const connectionFactory = require('../../../src/db/connection-factory.js');

describe('repo/users.js', () => {
	beforeEach(() => {
		jest.spyOn(connectionFactory, 'get');
		connectionFactory.get.mockReturnValue({
			query: () => { return { rows:  [] }; }
		});
		jest.spyOn(repo, 'getSingleOrNull');
	});

	it('adds a new user', async () => {
		const username = 'test_user';
		const hash = 'asdfasdfasdf';
		const salt = 'qwertyuiop';
		const expectedSql = `
INSERT INTO Users(Username, PasswordHash, Salt, LastLogin, FailedAttempts, LastFailedAttempt)
VALUES ($1, $2, $3, $4, 0, null) RETURNING Id`;
		const expectedArgs = [username, hash, salt, expect.any(Date)];
		await users.addAsync(username, hash, salt);
		expect(repo.getSingleOrNull).toHaveBeenCalledWith(expectedSql, expect.arrayContaining(expectedArgs));
	});
});