/**
 * @name token.js
 * @description Token authorization endpoint
 */
const express = require('express');

const audit = require('../util/audit.js');
const errorResponses = require('../responses/error.js');
const jwt = require('../service/jwt.js');
const logger = require('../util/logger.js').child({ label: 'api/token.js' });
const userService = require('../service/user.js');

/**
 * The router object
 * @type {object}
 */
const router = express.Router({ mergeParams: true });

/**
 * Verifies that the content-type is urlencoded.
 * This is required by the OAuth2 spec.
 * @param {object} req
 * @returns {boolean}
 */
const isValidContentType = (req) => {
	return req.headers && req.headers['content-type']
        && req.headers['content-type'].toLowerCase().indexOf('www-form-urlencoded') !== -1;
};

/**
 * Gets any validation errors that would result in a 400
 * @param {object} req
 * @param {object} res
 * @returns {object|null}
 */
const getValidationError = (req, res) => {
	const missingParamError = 'Token requests require a username and password.';
	if (!isValidContentType(req)) {
		return errorResponses.badRequest(res, 'Token requests must have a content type of x-www-form-urlencoded');
	}

	if (!req.body) {
		return errorResponses.badRequest(res, missingParamError);
	}

	if (!req.body.username) {
		return errorResponses.badRequest(res, missingParamError);
	}

	if (!req.body.password) {
		return errorResponses.badRequest(res, missingParamError);
	}

	return null;
};

/**
 * Endpoint for getting a new JWT
 * @param {object} req
 * @param {object} res
 */
const post = async (req, res) => {
	const ipAddr = audit.getIpAddress(req);
	const validationError = getValidationError(req, res);

	if (validationError !== null) {
		logger.audit(`Improperly formed login request from ${ipAddr}`);
		return validationError;
	}

	const loginResult = await userService.userLoginAsync(req.body.username, req.body.password, ipAddr);
	if (loginResult.result !== userService.loginResults.success) {
		return errorResponses.badRequest(res, loginResult.result);
	}

	const token = await jwt.createJwtAsync(loginResult.user);
	res.status(200).json({
		success: true,
		token: token
	});
};


router.post('/token', post);

module.exports = router;
