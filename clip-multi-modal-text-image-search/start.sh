#!/bin/bash

docker-compose up -d

./create_schema.sh

./import.sh

cd frontend && yarn && yarn start
