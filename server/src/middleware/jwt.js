/**
 * @name jwt.js
 * @description JWT validation middleware
 */

const jwt = require('jsonwebtoken');

const errors = require('../responses/error.js');
const logger = require('../util/logger.js').child({ label: 'middleware/jwt.js'});

/**
 * Checks the JWT token that was passed to ensure that the user is authenticated and authorized
 * @param {object} req
 * @param {object} res
 */
const checkToken = (req, res) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader) {
		return errors.forbidden(res);
	}

	const splitToken = authHeader.split('Bearer ');
	if (splitToken.length !== 2) {
		return errors.badRequest('Invalid bearer token format.');
	}

	try {
		// TODO: 
		//      - Add JWT_SECRET_KEY to defaults.env
		//      - Add JWT_SECRET_KEY to .env
		//      - Add JWT_SECRET_KEY to app
		const decoded = jwt.verify(splitToken[1], req.app.get('SOME SECRET KEY'));
		req.decoded = decoded;
	} catch (e) {
		logger.error('Exception caught while attempting to verify JWT.');
		logger.audit('Filed JWT decoding.', e);
		return errors.forbidden(res);
	}
};

module.exports = checkToken;
