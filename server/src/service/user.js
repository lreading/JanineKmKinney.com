/**
 * @name user.js
 * @description Service layer abstraction for users
 */
const crypto = require('../util/crypto.js');
const logger = require('../util/logger.js').child({ label: 'service/user.js' });
const repo = require('../repo/users.js');
const secrets = require('../util/secrets.js');

/**
 * Minimum password requirements for new passwords
 * @type {object}
 */
const passwordRequirements = {
	minLength: 8,
	minUpper: 1,
	minNumeric: 1,
	minSymbol: 1
};

/**
 * The different results of a login attempt
 */
const loginResults = {
	success: 'Success',
	invalidUsernameOrPassword: 'Invalid Username or Password',
	lockedOut: 'User is locked out.  Please contact support for help unlocking your account'
};

/**
 * Verifies that a password meets the minimum password requirements
 * @param {string} password
 * @returns {boolean}
 */
const doesPasswordMeetRequirements = (password) => {
	// A complicated regex could probably do this all at once.
	// For readability, we will handle each case one at a time.
	if (!password) {
		return false;
	}

	if (password.length < passwordRequirements.minLength) {
		return false;
	}

	if (!password.match(/[0-9]/)) {
		return false;
	}

	if (!password.match(/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/)) {
		return false;
	}

	if (!password.match(/[A-Z]/)) {
		return false;
	}

	if (!password.match(/[a-z]/)) {
		return false;
	}

	return true;
};

/**
 * Sanitizes the user object for when it may be passed back to the UI
 * @param {object} user
 * @returns {object}
 */
const sanitizeUser = (user) => {
	return {
		id: user.id,
		username: user.username
	};
};

/**
 * Creates a new user account
 * @param {string} username
 * @param {string} password
 * @returns {object}
 */
const createUserAsync = async (username, password) => {
	logger.audit(`Attempting to create user with username: ${username}`);
	const passwordHash = await crypto.encryptWithSaltAsync(password);
	const id = await repo.addAsync(username, passwordHash);
	const user = await repo.getByIdAsync(id);
	return sanitizeUser(user);
};

/**
 * Attempts to log a user in.
 * Returns an object with the result string and the user object(or null)
 * Result strings are exposed as the loginResults object
 * @param {string} username
 * @param {string} password
 * @param {string} ipAddr
 * @returns {{ string, object}}
 */
const userLoginAsync = async (username, password, ipAddr) => {
	const user = await repo.getByNameAsync(username.toLowerCase());

	if (!user) {
		// To avoid user enumeration, we will trigger a dummy compareHash
		// so that the requests take the same(ish) amount of time
		await crypto.compareHashAsync('ThisisNotARealHash', 'ThisWillNeverPassButWeNeverCheck');
		logger.audit(`Failed attempt to login as unknown user ${username} from ${ipAddr}`);
		return {
			result: loginResults.invalidUsernameOrPassword,
			user: null
		};
	}

	// Validate the password first, even if the user is locked out.
	// We want to ensure that login attempts are somewhat time consuming.
	const isValidPass = await crypto.compareHashAsync(password, user.passwordhash);
		
	const maxLoginFailures = parseInt(secrets.get('MAX_FAILED_LOGIN_ATTEMPTS') || 3, 10);

	// Use is locked out already:
	if (user.failedattempts >= maxLoginFailures) {
		logger.audit(`User ${username} is now locked out by failed attempt from ${ipAddr}`);
		return {
			result: loginResults.lockedOut,
			user: null
		};
	}

	if (isValidPass) {
		logger.audit(`Successful login for ${username} from ${ipAddr}`);
		await repo.updateLoginMetaAsync(user.id, new Date(), 0, null);
		return {
			result: loginResults.success,
			user: sanitizeUser(user)
		};
	}

	// If we made it this far, the password was invalid for the user.
	logger.audit(`Invalid password provided for ${username} from ${ipAddr}`);
	const failedAttempts = user.failedattempts + 1;
	await repo.updateLoginMetaAsync(user.id, user.lastlogin, failedAttempts, new Date());
	if (failedAttempts >= maxLoginFailures) {
		logger.audit(`Max failed attempts reached for user ${username} by ${ipAddr}. Locking out.`);
		return {
			result: loginResults.lockedOut,
			user: null
		};
	}

	return {
		result: loginResults.invalidUsernameOrPassword,
		user: null
	};
};

module.exports = {
	createUserAsync,
	doesPasswordMeetRequirements,
	loginResults,
	sanitizeUser,
	userLoginAsync
};
