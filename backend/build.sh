#!/bin/bash

set -o errexit

# Change to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Fake initial migrations if needed to fix order issue
python manage.py migrate --fake users
python manage.py migrate --fake admin

# Apply all migrations properly
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput
