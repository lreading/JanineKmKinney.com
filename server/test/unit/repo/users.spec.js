const expect = require('chai').expect;
const sinon = require('sinon');

const connectionFactory = require('../../../src/db/connection-factory.js');
const repo = require('../../../src/repo/repo.js');
const users = require('../../../src/repo/users.js');

describe('repo/users.js', () => {
	let sandbox;
	let getSingleOrNullSpy;
	let queryAsyncSpy;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		sandbox.stub(connectionFactory, 'get').returns({
			query: () => { return { rows:  [] }; }
		});
		getSingleOrNullSpy = sandbox.spy(repo, 'getSingleOrNull');
		queryAsyncSpy = sandbox.spy(repo, 'queryAsync');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('adds a new user', async () => {
		const username = 'test_user';
		const hash = 'asdfasdfasdf';
		const expectedSql = `
INSERT INTO Users(Username, PasswordHash, LastLogin, FailedAttempts, LastFailedAttempt)
VALUES ($1, $2, $3, 0, null) RETURNING Id`;
		const expectedArgs = [username, hash];
		await users.addAsync(username, hash);
		expect(getSingleOrNullSpy.calledWithMatch(expectedSql, sinon.match.array.contains(expectedArgs))).to.be.true;
	});

	it('gets a user by name', async () => {
		const username = 'test_user';
		const expectedSql = 'SELECT * FROM Users WHERE Username = $1';
		await users.getByNameAsync(username);
		expect(getSingleOrNullSpy.calledWith(expectedSql, [username])).to.be.true;
	});

	it('updates login meta', async () => {
		const id = 92;
		const lastLogin = new Date();
		const failedAttempts = 0;
		const lastFailedAttempt = null;
		const expectedSql = 'UPDATE Users SET LastLogin = $1, FailedAttempts = $2, LastFailedAttempt = $3 WHERE Id = $4';
		const expectedArgs = [lastLogin, failedAttempts, lastFailedAttempt, id];
		await users.updateLoginMetaAsync(id, lastLogin, failedAttempts, lastFailedAttempt);
		expect(queryAsyncSpy.calledWith(expectedSql, expectedArgs)).to.be.true;
	});
});