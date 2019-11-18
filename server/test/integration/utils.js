/**
 * @name utils.js
 * @description Utility functions that are for testing only
 */
const request = require('supertest');

/**
 * Gets the base URL for testing
 */
const baseUrl = process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:8000/api';

/**
 * Creates a new user
 * @param {string} username
 * @param {string} password
 * @returns {Promise}
 */
const createUserAsync = async (username, password) => {
	await request(baseUrl)
		.post('/users')
		.send({
			username: username,
			password: password
		});
};

/**
 * Attempts to log in (via oauth2)
 * @param {string} username
 * @param {string} password
 * @returns {object}
 */
const loginAsync = async (username, password) => {
	const res = await request(baseUrl)
		.post('/token')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.send(getLoginBody(username, password));
	return res.body;
};

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

/**
 * Gets the login POST body as URLEncoded
 * @param {string} username
 * @param {string} password
 * @returns {string}
 */
const getLoginBody = (username, password) => {
	return `username=${username}&password=${password}`;
};

module.exports = {
	baseUrl,
	createUserAsync,
	getLoginBody,
	getRandomUsername,
	loginAsync
};
