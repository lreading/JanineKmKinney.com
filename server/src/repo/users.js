/**
 * @name users.js
 * @description User repository
 */
const logger = require('../util/logger.js').child({ label: 'repo/repo.js' });
const repo = require('./repo.js');

/**
 * 
 * @param {string} username
 * @param {string} hash
 * @returns {number} The user id
 */
const addAsync = async (username, hash) => {
	logger.audit(`Creating new user: ${username}`);
	const query = `
INSERT INTO Users(Username, PasswordHash, LastLogin, FailedAttempts, LastFailedAttempt)
VALUES ($1, $2, $3, 0, null) RETURNING Id`;
	const res = await repo.getSingleOrNull(query, [username.toLowerCase(), hash, new Date()]);
	return res ? res.id : -1;
};

/**
 * Gets a user by their ID
 * @param {number} id
 * @returns {object}
 */
const getByIdAsync = async (id) => repo.getByIdAsync('Users', id);

/**
 * Gets a user by their name
 * @param {string} name
 * @returns {object}
 */
const getByNameAsync = async (name) => {
	const query = 'SELECT * FROM Users WHERE Username = $1';
	return await repo.getSingleOrNull(query, [name.toLowerCase()]);
};

/**
 * Updates the metadata regarding login attempts
 * @param {number} id
 * @param {Date} lastLogin
 * @param {number} failedAttempts
 * @param {Date?} lastFailedAttempt
 * @returns {Promise}
 */
const updateLoginMetaAsync = async (id, lastLogin, failedAttempts, lastFailedAttempt) => {
	const query = 'UPDATE Users SET LastLogin = $1, FailedAttempts = $2, LastFailedAttempt = $3 WHERE Id = $4';
	await repo.queryAsync(query, [lastLogin, failedAttempts, lastFailedAttempt, id]);
};

module.exports = {
	addAsync,
	getByIdAsync,
	getByNameAsync,
	updateLoginMetaAsync
};
