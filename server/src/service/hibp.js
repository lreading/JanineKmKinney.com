/**
 * @name hibp.js
 * @description Have I Been Pwned API Abstraction layer, specifically pwnedpasswords
 */
const crypto = require('crypto');

const request = require('request-promise-native');

const logger = require('../util/logger.js').child({ label: 'service/hibp.js' });
const secrets = require('../util/secrets.js');

/**
 * The base URI of the service
 * @type {string}
 */
const baseUri = 'https://api.pwnedpasswords.com';

/**
 * Gets a SHA1 sum of a string
 * NOTE: SHA1 is not considered cryptographically secure
 * This is implemented for the HIBP API only
 * @param {string} text
 * @returns {string}
 */
const getSHA1 = (text) => crypto.createHash('sha1').update(text).digest('hex').toUpperCase();

/**
 * Makes an authenticated request to the HIBP API
 * Not a feature rich implementation since only GETs are used at this time.
 * @param {string} url
 * @returns {Promise}
 */
const makeApiRequest = async (url) => await request.get(url);

/**
 * Searches the pwnedpasswords.com database for this password.
 * Returns a true/false, true if the password appears at least once in the result set.
 * 
 * This API implements a k-Anonymity model that allows passwords
 * to be searched for by partial hash.  Only 3 characters of a SHA-1
 * password hash (case insensitive) are required.
 * 
 * @param {string} passwordPlainText
 * @returns {boolean}
 */
const hasPasswordBeenPwned = async (passwordPlainText) => {
	if (secrets.get('USE_HIBP') !== 'true') {
		logger.debug('HIBP API disabled via config.  Skipping.');
		return false;
	}

	logger.debug('Attempting to search HIBP to see if the password has been leaked.');
	const hash = getSHA1(passwordPlainText);
	const prefix = hash.substr(0, 5);
	const suffix = hash.replace(prefix, '');
	const url = `${baseUri}/range/${prefix}`;
	const res = await makeApiRequest(url);

	return res.includes(suffix);
};

module.exports = {
	hasPasswordBeenPwned
};
