#!/bin/bash

TEST_SETUP_DIR=".test_setup"
TEST_SECRETS_DIR=".test_secrets"

# Cleanup any files from the last run (if they exist)
rm -rf $TEST_SETUP_DIR
rm -rf $TEST_SECRETS_DIR
mkdir -p $TEST_SETUP_DIR
mkdir -p $TEST_SECRETS_DIR
rm -f .env

# Create a new database container that will automagically add a test user for us
cp ../database/Dockerfile $TEST_SETUP_DIR
cp -r ../database/scripts $TEST_SETUP_DIR/scripts
cp ../database/docker-healthcheck $TEST_SETUP_DIR
cp test-db/*.sql $TEST_SETUP_DIR/scripts

# Copy the environment variables from THIS user's .env file in /server,
# and expand them into individual files in the test secrets dir
cat ../server/.env | while read secret; do
    # Probably a cleaner way of doing this...
    key=$(echo -n $secret | cut -d "=" -f 1)
    val=$(echo -n $secret | cut -d "=" -f 2)

    # We want to use the host that the docker network is expecting
    if [ "$key" == "POSTGRES_HOST" ]
    then
        val="database"
    fi

    # Write it to a faux docker-secrets file
    echo -n $val > $TEST_SECRETS_DIR/$key

    # Write to a local .env file for use by docker-compose
    echo "$key=$val" >> .env
done

# Tell docker-compose where the test setup dir is
echo "TEST_SETUP_DIR=$TEST_SETUP_DIR" >> .env

# Start the docker containers
docker-compose build
docker-compose up -d

# TODO: Wait until containers are healthy