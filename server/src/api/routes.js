/**
 * @name routes.js
 * @description All API routes
 */
const express = require('express');
const router = express.Router({ mergeParams: true });

const errorResponses = require('../responses/error.js');
const users = require('./users.js');

/**
 * Return a 404 for the /api endpoint
 */
router.get('/', (req, res) => {
	return errorResponses.notFound(res);
});

router.use('/users', users);

module.exports = router;