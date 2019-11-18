/**
 * @name audit.js
 * @description Helper functions for audit logging
 */

/**
 * Gets the client IP address for a given request.
 * Knowing that this will be behind a reverse proxy in production,
 * we need to be careful to check the 'x-forwarded-for' header.
 * @param {object} req
 * @returns {string} (potentially comma separated list)
 */
const getIpAddress = (req) => {
	if (!req) {
		return '';
	}

	if (req.headers && req.headers['x-forwarded-for']) {
		return req.headers['x-forwarded-for'];
	}
	if (req.connection && req.connection.remoteAddress) {
		return req.connection.remoteAddress;
	}
	return '';
};

module.exports = {
	getIpAddress
};
