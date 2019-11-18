/**
 * @name routes.js
 * @description All API routes
 */
const express = require('express');
const router = express.Router({ mergeParams: true });

const errorResponses = require('../responses/error.js');
const jwt = require('../middleware/jwt.js');
const token = require('./token.js');
const users = require('./users.js');

/**
 * Return a 404 for the /api endpoint
 */
router.get('/', (req, res) => {
	return errorResponses.notFound(res);
});

router.use('/', token);
// JWT middleware is implemented on specific methods in the users endpoints
router.use('/users', users);

// All other routes require authentication
router.use(jwt);

module.exports = router;