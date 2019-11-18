/**
 * @name jwt.js
 * @description JWT validation middleware
 */
const errors = require('../responses/error.js');
const jwt = require('../service/jwt.js');
const logger = require('../util/logger.js').child({ label: 'middleware/jwt.js'});

/**
 * Checks the JWT token that was passed to ensure that the user is authenticated and authorized
 * @param {object} req
 * @param {object} res
 */
const checkToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader) {
		return errors.forbidden(res);
	}

	const splitToken = authHeader.split('Bearer ');
	if (splitToken.length !== 2) {
		return errors.badRequest('Invalid bearer token format.');
	}

	const token = jwt.getValidatedToken(splitToken[1]);
	if (!token) {
		logger.warn('Attempt to use an invalid token caught.');
		return errors.forbidden(res);
	}

	req.jwt = token;
	if (next) {
		next();
	}
};

module.exports = checkToken;
