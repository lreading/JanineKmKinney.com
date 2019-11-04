/**
 * @name secrets.js
 * @description Abstraction layer for reading docker secrets.
 * Based largely on https://medium.com/lucjuggery/from-env-variables-to-docker-secrets-bc8802cacdfd
 */
const fs = require('fs');

const logger = require('./logger.js').child({ label: 'secrets.js' });

/**
 * Validates the secret name.
 * @param {string} secret
 */
const validateName = (secret) => {
	const match = secret.match(/[A-Z0-9_]+/);
	if (match.length === 0) {
		const message = `Invalid secret name: ${secret}`;
		logger.audit(message);
		throw new Error(message);
	}
	return match[0];
};

/**
 * Gets a secret from either the environment, or docker secrets
 * @param {string} secret
 * @return {string}
 */
const get = (secret) => {
	try {
		const safeName = validateName(secret);
		const secretFile = `/run/secrets/${safeName}`;
        
		// Always check for docker secrets before checking the node env
		if (!fs.existsSync(secretFile)) {
			return process.env[safeName] || '';
		}

		const val = fs.readFileSync(secretFile).toString('utf8');
		// Special case for any variable encased in double-quotes:
		const matches = val.match(/"(.*?)"/);
		return matches
		  ? matches[1]
		  : val;
	} catch (e) {
		logger.error(`Error reading secret for ${secret}`);
		logger.debug(e);
		return '';
	}
};

module.exports = {
	get
};
