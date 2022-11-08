#!/bin/bash

set -eou pipefail

# time for weaviate to get live
sleep 5

python3 create-schema.py

python3 images-to-base64.py

python3 upload-data-objects.py

python3 flask-app/application.py
