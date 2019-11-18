/**
 * @name errors.js
 * @description Middleware for error handling
 */
const errorResponses = require('../responses/error.js');
const logger = require('../util/logger').child({ label: 'middleware/errors.js' });

/**
 * Error-handling middleware.  Returns a generic 500 error.
 * Must have 4 arguments to identify it as an error handler to express
 * @param {object} err
 * @param {object} req
 * @param {object} res
 * @param {next} function
 */
const errorHandler = (err, req, res) => {
	logger.error(err);
	return errorResponses.internalServerError(res);
};

module.exports = errorHandler;
