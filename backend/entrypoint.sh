#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Django Entrypoint..."

# Apply database migrations (SQLite will be created if it doesn't exist)
echo "Applying database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Execute the main container command (e.g., gunicorn or celery)
echo "Executing command: $@"
exec "$@"
