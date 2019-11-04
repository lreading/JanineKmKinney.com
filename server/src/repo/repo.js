/**
 * @name repo.js
 * @description Base implementation of a generic repository
 */
const connectionFactory = require('../db/connection-factory.js');
const logger = require('../util/logger.js').child({ label: 'repo/repo.js' });

/**
 * Gets a single result or null if not found
 * @param {string} query
 * @param {object[]} args
 */
const getSingleOrNull = async (query, args) => {
	const client = connectionFactory.get();
	logger.debug(query);
	logger.debug(args);
	const res = await client.query(query, args);
	return res.rows.length ? res.rows[0] : null;
};

/**
 * Gets a unique record by its id
 * @param {string} tableName
 * @param {number} id
 * @returns {object|null}
 */
const getByIdAsync = async (tableName, id) => {
	const query = `SELECT * FROM ${tableName} WHERE Id = $1`;
	return await getSingleOrNull(query, [id]);
};

/**
 * Gets a unique entry by name
 * @param {string} tableName
 * @param {string} name
 */
const getByNameAsync = async (tableName, name) => {
	const query = `SELECT * FROM ${tableName} WHERE Name = $1`;
	return await getSingleOrNull(query, [name]);
};

/**
 * 
 * @param {string} sql
 * @param {object[]} args
 * @returns {object}
 */
const queryMultipleAsync = async (sql, args) => {
	const connection = connectionFactory.get();
	const res = await connection.query(sql, args);
	return res.rows;
};

module.exports = {
	getByIdAsync,
	getByNameAsync,
	getSingleOrNull,
	queryMultipleAsync
};
