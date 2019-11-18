/**
 * @name logger.js
 * @description Logging abstraction
 */

const winston = require('winston');

/**
 * Custom logging levels for this application
 * @type {object}
 */
const config = {
	levels: {
		error: 0,
		audit: 1,
		warn: 2,
		info: 3,
		data: 4,
		debug: 5,
		verbose: 6,
		silly: 7
	},
	colors: {
		error: 'red',
		audit: 'yellow',
		warn: 'yellow',
		info: 'green',
		data: 'grey',
		debug: 'blue',
		verbose: 'cyan',
		silly: 'magenta',
	}
};

/**
 * The default formatting to use for writing to log files
 * @type {object}
 */
const logfileFormat = winston.format.combine(winston.format.timestamp(), winston.format.simple());

/**
 * The default log formatting for the console
 * @type {object}
 */
const consoleFormat = winston.format.combine(
	winston.format.timestamp(),
	winston.format.colorize(),
	winston.format.simple()
);

/**
 * Determines if we should keep the logging silent
 * @type {boolean}
 */
const silent = process.env.NODE_ENV === 'testing';

winston.addColors(config.colors);

module.exports = winston.createLogger({
	level: 'silly',
	levels: config.levels,
	format: logfileFormat,
	transports: [
		new winston.transports.Console({ format: consoleFormat, silent }),
		new winston.transports.File({ filename: 'error.log', level: 'error', handleExceptions: true, silent }),
		new winston.transports.File({ filename: 'audit.log', level: 'audit', handleExceptions: true, silent }),
		new winston.transports.File({ filename: 'combined.log', silent })
	],
	exitOnError: false
});
