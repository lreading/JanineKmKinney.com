/**
 * @name users.js
 * @description The Resource for the users object
 */
const express = require('express');

const errorResponses = require('../responses/error.js');
const logger = require('../util/logger.js').child({ label: 'api/users.js' });
const userService = require('../service/user.js');
const userRepo = require('../repo/users.js'); 
const validators = require('../util/validators.js');

/**
 * The router object
 * @type {object}
 */
const router = express.Router({ mergeParams: true });

// TODO: Consider removing this entire resource, we may not need it for the actual application.
// TODO: Add auth middleware here

/**
 * Gets a user by their id
 * @param {object} req
 * @param {object} res
 */
const getById = async (req, res) => {
	if (!req.params.userId) {
		return errorResponses.badRequest(res, 'User id is required.');
	}

	const user = await userRepo.getByIdAsync(req.params.userId);
	if (!user) {
		logger.audit(`Attempting to get non-existing user with id ${req.params.userId}`);
		return errorResponses.notFound(res);
	}
	res.json(userRepo.sanitizeUser(user));
};

const post = async (req, res) => {
	if (!req.body) {
		return errorResponses.badRequest(res, 'User object required.');
	}

	const username = req.body.username;
	const password = req.body.password;

	try {
		validators.validateRequiredString(username, 'username', 1, 49);
	} catch (e) {
		return errorResponses.badRequest(res, e.message);
	}

	if (!userService.doesPasswordMeetRequirements(password)) {
		return errorResponses.badRequest(res, 'Passwords must be at least 8 characters, and have at least 1 uppercase, 1 lowercase and 1 special character.');
	}


	const existingUser = await userRepo.getByNameAsync(username);
	if (existingUser) {
		logger.audit(`User already exists with username ${username}`);
		return errorResponses.badRequest(res, 'Username unavailable.');
	}

	const user = await userService.createUserAsync(username, password);
	res.json(user);
};

router.get('/', (req, res) => errorResponses.notFound(res));
router.delete('/:userId', (req, res) => errorResponses.notFound(res));
router.put('/:userId', (req, res) => errorResponses.notFound(res));
router.post('/', post);
router.get('/:userId', getById);

module.exports = router;
