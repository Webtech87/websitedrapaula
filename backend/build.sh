#!/bin/bash

set -o errexit

# Change to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Remove all migration files except for `__init__.py` (you should do this only if needed)
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete

# Recreate migrations
python manage.py makemigrations

# Apply migrations in the correct order
python manage.py migrate admin
python manage.py migrate users
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput