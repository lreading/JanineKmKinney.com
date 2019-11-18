/**
 * @name jwt.js
 * @description Abstraction layer for JSON Web Tokens
 */
const jwt = require('jsonwebtoken');

const audit = require('../util/audit.js');
const logger = require('../util/logger.js').child({ label: 'util/jwt.js' });
const secrets = require('../util/secrets.js');

/**
 * Default JWT options
 * @type {object}
 */
const jwtOptions = {
	issuer: 'janinekmkinney.com',
	audience: ''
};

/**
 * Creates a new JSON Web Token
 * @param {object} user
 * @returns {string}
 */
const createJwtAsync = async (user) => {
	const key = secrets.get('JWT_SECRET_KEY');
	const payload = { user };
	const opts = Object.assign({}, jwtOptions, {
		subject: user.username,
		expiresIn: secrets.get('JWT_EXPIRATION'),
	});
	logger.audit(`Creating new JWT for user ${user.username}`);
	return await jwt.sign(payload, key, opts);
};

/**
 * Verifies that a JWT is valid
 * @param {string} token
 * @returns {object}
 */
const getValidatedToken = (token, req) => {
	const key = secrets.get('JWT_SECRET_KEY');
	try {
		const decoded = jwt.verify(token, key);
		return decoded;
	} catch (ex) {
		logger.debug(`Error verifying JWT from ${audit.getIpAddress(req)}`);
		logger.debug(ex);
		return null;
	}
};

module.exports = {
	createJwtAsync,
	getValidatedToken
};
