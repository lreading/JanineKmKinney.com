/**
 * @name utils.js
 * @description Utility functions that are for testing only
 */

/**
 * Gets the base URL for testing
 */
const baseUrl = process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:8000/api';

/**
 * Gets a  "random" alphanumeric character
 * @returns {string}
 */
const getAlphaNumericChar = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return chars[Math.floor(Math.random() * chars.length)];
};

/**
 * Generates a "random" username
 * @param {number} length
 * @returns {string}
 */
const getRandomUsername = (length) => {
    let username = '';
    for (let i = 0; i < length; i++) {
        username += getAlphaNumericChar();
    }
    return username;
};

module.exports = {
    baseUrl,
    getRandomUsername
};
