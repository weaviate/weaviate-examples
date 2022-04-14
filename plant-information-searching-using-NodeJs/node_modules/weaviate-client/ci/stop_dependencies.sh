#!/bin/bash

docker-compose down
rm -rf weaviate-data || true
