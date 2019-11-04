const connectionFactory = require('../../../src/db/connection-factory.js');
const repo = require('../../../src/repo/repo.js');

describe('repo/repo.js', () => {
	const tableName = 'entity1';
	let mockPool;

	beforeEach(() => {
		mockPool = {
			query: () => { return { rows: [ { } ]}; } 
		};
		jest.spyOn(mockPool, 'query');
        
		jest.spyOn(connectionFactory, 'get');
		connectionFactory.get.mockReturnValue(mockPool);
	});

	it('gets an item by id', async () => {
		await repo.getByIdAsync(tableName, 1);
		const expectedSql = `SELECT * FROM ${tableName} WHERE Id = $1`;
		expect(mockPool.query).toHaveBeenCalledWith(expectedSql, [1]);
	});

	it('gets an item by name', async () => {
		const name = 'entity name';
		await repo.getByNameAsync(tableName, name);
		const expectedSql = `SELECT * FROM ${tableName} WHERE Name = $1`;
		expect(mockPool.query).toHaveBeenCalledWith(expectedSql, [name]);
	});
});
