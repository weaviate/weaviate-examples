#!/usr/bin/env bash

set -eou pipefail

function start_weaviate() {
  docker compose up -d

  while ! curl --fail -o /dev/null -s http://localhost:8080/v1/.well-known/ready; do
    echo "Waiting for Weaviate to be ready..."
    sleep 1;
  done
}

function import_with_curl() {
  ./import/curl/create_schema.sh
  ./import/curl/import.sh
}

start_weaviate

import_with_curl

cd frontend && yarn && yarn start
