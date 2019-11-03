/**
 * @name index.js
 * @description Entry-point for server application.
 * Starts an express server
 */

const http = require('http');
const path = require('path');

const express = require('express');

const logger = require('./src/util/logger').child({ label: 'src/index.js' });

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

// TODO: Add modules to express as needed
// TODO:: Add routes as needed

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use('/', path.join(__dirname, staticFilesDir));
// TODO: Add static path for index.html file (SPA)

// TODO: Set client secret for JWT

// TODO: Remove
app.get('/', (req, res) => res.json({ status: 200, message: 'Hello, world!' }));
app.listen(port, () => logger.info(`Server started at http://localhost:${port}/`));
