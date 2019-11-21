# JanineKmKinney.com
Source code for JanineKmKinney.com

# Server
## Secrets
Secrets used for local development should be stored in the server/.env file.
There is a defaults.env file used as a template to populate your own secrets.  When in production, the .env file will not exist, and secrets will be handled by docker secrets via docker-compose.

Generating a psuedo-random key: node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"

## TODO:
- Consider creating an IP ban mechanism?
- Iplement password reset
- Implement haveibeenpwned API for passwords?
- Remove the register endpoints from production
- Create a way of adding a user after the env is stood up (maybe a one-off script inside the docker container?)
- Create APIs for page / page sections

## Tests
Unit tests are written using jest, integration tests are written using jest/supertest.
All routes are tested with supertest as integration tests.
The dev/testSetup.sh script will start an integration test server for you (requires docker / docker-compose)

# Database
There is a helper script to start the databse locally.  Ensure that you have your .env file at the root of the server directory.

# Site
TODO
- Be sure to include a CC Attribution 4.0 referencing haveibeenpwned for anything checking passwords