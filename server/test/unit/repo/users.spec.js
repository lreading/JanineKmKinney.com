const users = require('../../../src/repo/users.js');
const repo = require('../../../src/repo/repo.js');
const connectionFactory = require('../../../src/db/connection-factory.js');

describe('repo/users.js', () => {
	beforeEach(() => {
		jest.resetModules();
		jest.spyOn(connectionFactory, 'get');
		connectionFactory.get.mockReturnValue({
			query: () => { return { rows:  [] }; }
		});
		jest.spyOn(repo, 'getSingleOrNull');
		jest.spyOn(repo, 'queryAsync');
	});

	it('adds a new user', async () => {
		const username = 'test_user';
		const hash = 'asdfasdfasdf';
		const expectedSql = `
INSERT INTO Users(Username, PasswordHash, LastLogin, FailedAttempts, LastFailedAttempt)
VALUES ($1, $2, $3, 0, null) RETURNING Id`;
		const expectedArgs = [username, hash, expect.any(Date)];
		await users.addAsync(username, hash);
		expect(repo.getSingleOrNull).toHaveBeenCalledWith(expectedSql, expect.arrayContaining(expectedArgs));
	});

	it('gets a user by name', async () => {
		const username = 'test_user';
		const expectedSql = 'SELECT * FROM Users WHERE Username = $1';
		await users.getByNameAsync(username);
		expect(repo.getSingleOrNull).toHaveBeenCalledWith(expectedSql, expect.arrayContaining([username]));
	});

	it('updates login meta', async () => {
		const id = 92;
		const lastLogin = new Date();
		const failedAttempts = 0;
		const lastFailedAttempt = null;
		const expectedSql = 'UPDATE Users SET LastLogin = $1, FailedAttempts = $2, LastFailedAttempt = $3 WHERE Id = $4';
		const expectedArgs = [lastLogin, failedAttempts, lastFailedAttempt, id];
		await users.updateLoginMetaAsync(id, lastLogin, failedAttempts, lastFailedAttempt);
		expect(repo.queryAsync).toHaveBeenCalledWith(expectedSql, expectedArgs);
	});
});