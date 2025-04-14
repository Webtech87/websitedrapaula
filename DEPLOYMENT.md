# Deployment Notes for Django + React (Vite) App on Render

This setup assumes that in the same project there are two separate folders: `backend/` (Django) and `frontend/` (React-Vite) 

## Web Service

The backend part of the project (Django) should be deployed as a Web Service on Render.  

### Setup

In your `settings.py`, in the backend folder, have the following:  
  
1. Environment Variables:  
All secret variables should be stored in a .env file.  
Use `load_dotenv()` to access these variables:
```
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
EMAIL_SENDER = os.getenv('EMAIL_SENDER')
EMAIL_SENDER_PASSWORD = os.getenv('EMAIL_SENDER_PASSWORD')

STRIPE_LIVE_SECRET_KEY = os.getenv("STRIPE_LIVE_SECRET_KEY")

STRIPE_ENDPOINT_SECRET = os.getenv('STRIPE_ENDPOINT_SECRET_LIVE')

# Add all other necessary variables
```

2. Change `DEBUG = True` to `DEBUG = False` for production.  
  
3. Add ALL URLs to your `ALLOWED_HOSTS`. Include localhost, Render's URLs and Custom Domains (if any).  
```
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'websitedrapaula.onrender.com', 'websitedrapaula-v2.onrender.com','websitedrapaula-frontend-v2.onrender.com', 'websitedrapaula-frontend.onrender.com', 'paulaserranoeducacao.pt']
```

4. Using WhiteNoise for deployment:  
```
pip install whitenoise
```
  
Add WhiteNoise to `MIDDLEWARE` BELOW SecurityMiddleware:
```
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be before CommonMiddleware for CORS
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    #...
]
```
  
To optimize static file delivery in production, add:  
```
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```
  
Make sure `staticfiles` is configured correctly in your static section:
```
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
```
  
5. CORS CONFIGURATION:  
Your `CORS_ALLOWED_ORIGINS` and `CORS_TRUSTED_ORIGINS` should have all frontend related URLs (development and production):  
```
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Only allow all in development
CORS_ALLOW_CREDENTIALS = True

if not CORS_ALLOW_ALL_ORIGINS:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "https://websitedrapaula-frontend.onrender.com",
        "https://websitedrapaula-frontend-v2.onrender.com",
        "https://paulaserranoeducacao.pt",
    ]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "https://websitedrapaula-frontend.onrender.com",
    "https://websitedrapaula-frontend-v2.onrender.com",
    "https://paulaserranoeducacao.pt",
]
```
  
6. Database on Render:  
For using a Render Database (postgres) first create a new database on the website.  
After that, copy and paste the `Internal Databse URL` to your `Environment Variables` on your Render's Web Service.  
In your `settings.py` change your database configuration to:
```
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(default=os.getenv('DATABASE_URL'))
}
```
  
7. Create a `build.sh` file in your root backend project folder:  
```build.sh
#!/bin/bash

set -o errexit

# Change to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Apply all migrations properly
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput
```
  
8. Install `gunicorn`
```
pip install gunicorn
```
  
DO NOT FORGET to always update your `requirements.txt`. It needs to have all dependencies used in your project
```
pip freeze > requirements.txt
```

### On Render
On your Dashboard, create a new Web Service. After giving it a name and choosing the repository and branch you want to deploy, add the following:
1. **On Build Command:** sh backend/build.sh
2. **On Start Command:** cd backend && gunicorn backend.wsgi:application  
  
## Static Site

The frontend part of the project (React-Vite) should be deployed as a Static Site on Render.  
It is much simpler then the backend part.  

### On Render
  
On your Dashboard, create a new Static Site. After giving it a name and choosing the repository and branch you want to deploy, add the following:  
1. **On Build Command:** cd frontend && npm install && npm run build
2. **On Publish Directory:** frontend/dist
  
If adding any Custom Domain, follow the instructions on Render. Each domain service has their own DNS configuration.
  
In a SPA (Single Page Application) project, it is important to add a Rewrite Rule to your Static Site. That's because when you build a SPA like React, you want all unmatched routes to serve your `index.html`, because your frontend app (React Router) handles the routing — not the server.  
  
So in `Redirect and Rewrite Rules`, add the following:
```
Source: /*
Destination: /index.html
Action: Rewrite
```
In simple words, this means **“Whatever the path is, match it.”**
  
**DO NOT USE** `/.*` in the Source filed, because Render treats it as a literal string. Meaning it would not match any route known by React.  
Using `/.*` would be the same as asking for the route `paulaserranoeducacao.pt/.*`, which does not exist and a 404 error will be raised.
