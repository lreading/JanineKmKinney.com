/**
 * @name crypto.js
 * @description Crypto functionality
 */
const bcrypt = require('bcrypt');

const secrets = require('./secrets.js');

/**
 * The number of rounds used to generate the salt
 * @returns {number}
 */
const getRounds = () => {
	const roundsConfig = secrets.get('CRYPTO_ROUNDS');
	if (roundsConfig && roundsConfig.length && !isNaN(roundsConfig)) {
		return parseInt(roundsConfig, 10);
	}
	return 15; // Safe(ish) default
};

/**
 * Encrypts a plaintext string with a salt
 * @param {string} plainText
 * @returns {string}
 */
const encryptWithSaltAsync = async (plainText) => await bcrypt.hash(plainText, getRounds());

/**
 * Compares a plaintext password to a hash
 * @param {string} plainText
 * @param {string} hash
 * @returns {boolean}
 */
const compareHashAsync = async (plainText, hash) => await bcrypt.compare(plainText, hash);

module.exports = {
	compareHashAsync,
	encryptWithSaltAsync
};
