/**
 * @name headers.js
 * @description Middleware that adds the default header values we want for all requests
 */

/**
 * Adds the default headers that we want attached to each response.
 * These are largely taken from OWASP's recommended security headers:
 * https://www.owasp.org/index.php/Security_Headers
 * @param {object} req
 * @param {object} res
 * @param {function?} next
 */
const addHeaders = (req, res, next) => {
	res.set('X-Frame-Options', 'SAMEORIGIN');
	res.set('X-XSS-Protection', '1; mode=block');
	res.set('X-Content-Type-Options', 'nosniff');
	res.set('X-Powered-By', 'Janine KM Kinney');
	if (next) {
		next();
	}
};

module.exports = addHeaders;
