/**
 * @name users.js
 * @description User repository
 */
const logger = require('../util/logger.js').child({ label: 'repo/repo.js' });
const repo = require('./repo.js');

/**
 * Sanitizes the user object for when it may be passed back to the UI
 * @param {object} user
 * @returns {object}
 */
const sanitizeUser = (user) => {
	return {
		id: user.id,
		username: user.username
	};
};

/**
 * 
 * @param {string} username
 * @param {string} hash
 * @param {string} salt
 * @returns {number} The user id
 */
const addAsync = async (username, hash, salt) => {
	logger.audit(`Creating new user: ${username}`);
	const query = `
INSERT INTO Users(Username, PasswordHash, Salt, LastLogin, FailedAttempts, LastFailedAttempt)
VALUES ($1, $2, $3, $4, 0, null) RETURNING Id`;
	const res = await repo.getSingleOrNull(query, [username, hash, salt, new Date()]);
	return res ? res.id : -1;
};

/**
 * Gets a user by their ID
 * @param {number} id
 */
const getByIdAsync = async (id) => repo.getByIdAsync('Users', id);

module.exports = {
	addAsync,
	getByIdAsync,
	sanitizeUser
};
