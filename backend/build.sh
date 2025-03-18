#!/bin/bash 

set -o errexit

# Change to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput