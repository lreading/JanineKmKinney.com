/**
 * @name error.js
 * @description Standard error responses for JSON requests
 */

/**
 * Generates an error message as a JSON response
 * @param {boolean} success
 * @param {number} status
 * @param {string} message
 */
const getError = (success, status, message) => {
	return {
		success,
		status,
		message
	};
};

/**
 * Standard bad request error response
 * @param {object} res
 * @param {string?} message
 */
const badRequest = (res, message) => {
	return res.status(400)
		.json(getError(false, 400, message || 'Bad Request'));
};

/**
 * Standard unauthorized error response
 * @param {object} res
 */
const unauthorized = (res) => {
	return res.status(401)
		.json(getError(false, 401, 'Unauthorized'));
};

/**
 * Standard unauthenticated error response
 * @param {object} res
 */
const forbidden = (res) => {
	return res.status(403)
		.json(getError(false, 403, 'Forbidden'));
};

/**
 * Standard not found response
 * @param {object} res
 */
const notFound = (res) => {
	return res.status(404)
		.json(getError(false, 404, 'Not Found'));
};

/**
 * Standard internal server error response
 * @param {object} res
 */
const internalServerError = (res) => {
	return res.status(500)
		.json(getError(false, 500, 'Internal Server Error'));
};

module.exports = {
	badRequest,
	unauthorized,
	forbidden,
	notFound,
	internalServerError
};
