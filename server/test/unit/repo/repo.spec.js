const expect = require('chai').expect;
const sinon = require('sinon');

const connectionFactory = require('../../../src/db/connection-factory.js');
const repo = require('../../../src/repo/repo.js');

describe('repo/repo.js', () => {
	const tableName = 'entity1';
	let poolSpy;
	let sandbox;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		const pool = {
			query: () => { return { rows: [ { } ]}; } 
		};
		poolSpy = sandbox.spy(pool, 'query');
		sandbox.stub(connectionFactory, 'get').returns(pool);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('gets an item by id', async () => {
		await repo.getByIdAsync(tableName, 1);
		const expectedSql = `SELECT * FROM ${tableName} WHERE Id = $1`;
		expect(poolSpy.calledWith(expectedSql, [1])).to.be.true;
	});

	it('gets an item by name', async () => {
		const name = 'entity name';
		await repo.getByNameAsync(tableName, name);
		const expectedSql = `SELECT * FROM ${tableName} WHERE Name = $1`;
		expect(poolSpy.calledWith(expectedSql, [name])).to.be.true;
	});

	it('Performs an arbitrary query', async () => {
		const expectedSql = 'UPDATE Foo SET Bar = $1 WHERE Id = $2';
		const args = ['test', 55];
		await repo.queryAsync(expectedSql, args);
		expect(poolSpy.calledWith(expectedSql, args)).to.be.true;
	});
});
