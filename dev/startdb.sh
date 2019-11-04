#!/bin/bash

build_db() {
    docker build -t janinekmkinney-db:dev ../database
}

run_db() {
    # -v $PWD/db-data:/var/lib/postgresql/data \
    docker run -d \
        --name janinekmkinney-db \
        -e POSTGRES_USER=$POSTGRES_USER \
        -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
        -e POSTGRES_DB=$POSTGRES_DB \
        janinekmkinney-db:dev 
}

source ../server/.env
docker rm -f janinekmkinney-db || true
build_db
run_db