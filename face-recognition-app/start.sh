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

function import_with_python() {
  cd ./import/python && pip3.8 install -r requirements.txt && python3.8 import.py && cd -
}

function run_frontend() {
  function cmd_node() {
    if ! hash "node" 2>/dev/null; then
      docker run -it --rm -p 3000:3000 -v "$PWD":/app -w /app node:18.9-slim $@
    else
      $@
    fi
  }
  cd ./frontend && cmd_node yarn && cmd_node yarn start
}

run_python=false
run_curl=true

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --python) run_curl=false; run_python=true ;;
    --curl) run_curl=true ;;
    *) echo "Unknown parameter passed: $1"; exit 1 ;;
  esac
  shift
done

start_weaviate

if $run_curl
then
  echo "Running import using curl"
  import_with_curl
fi

if $run_python
then
  echo "Running import using Python client"
  import_with_python
fi

run_frontend
