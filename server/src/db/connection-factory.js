/**
 * @name connection-factory.js
 * @description Client connection factory for access to the database 
 */
const { Pool } = require('pg');

const secrets = require('../util/secrets.js');

/**
 * The connection pool for db connections
 * @type {Pool}
 */
let pool;

/**
 * Creates the database pool and establishes a connection
 * to the database
 */
const connect = () => {
	pool = new Pool({
		user: secrets.get('POSTGRES_USER'),
		password: secrets.get('POSTGRES_PASSWORD'),
		database: secrets.get('POSTGRES_DB'),
		host: secrets.get('POSTGRES_HOST')
	});
};

/**
 * Attempts to disconnect the pool object.
 * Mostly here for testing
 */
const disconnect = () => {
	try {
		pool.end();
	} catch (ignore) {
		// Do nothing
	} finally {
		pool = undefined;
	}
};

/**
 * Gets an available connection to the database
 * While this technically returns a pool, the postgres 
 * recommended way of executing database queries in a webapplication
 * is running the query command against the pool object directly,
 * as it will use any available client in the pool
 * @returns { Pool }
 */
const get = () => pool;

module.exports = {
	connect,
	disconnect,
	get
};
