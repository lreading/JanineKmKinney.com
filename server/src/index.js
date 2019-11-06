/**
 * @name index.js
 * @description Starts an express application
 */
const path = require('path');

const dotenv = require('dotenv');
const express = require('express');

const db = require('./db/connection-factory.js');
const logger = require('./util/logger').child({ label: 'index.js' });
const api = require('./api/routes.js');

/**
 * The port that the server listens on
 * @type {number}
 */
const port = process.env.PORT || 8000;

/**
 * The relative directory where static files are held.
 * @type {string}
 */
const staticFilesDir = 'dist';

/**
 * The express application
 * @type {Express}
 */
const app = express();

/**
 * Read files from the .env file if it exists
 * If it does not, all environment variables should come
 * from docker secrets.
 * 
 * See README.md for more details
 */
dotenv.config();

// Establish a connection to the database
db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static(path.join(__dirname, staticFilesDir)));
// TODO: Add static path for index.html file (SPA)

// TODO: Add modules to express as needed
// TODO:: Add routes as needed
app.use('/api', api);

// TODO: Set client secret for JWT

// TODO: Remove
app.get('/', (req, res) => res.json({ status: 200, message: 'Hello, world!' }));

app.listen(port, () => logger.info(`Server started at http://localhost:${port}/`));
