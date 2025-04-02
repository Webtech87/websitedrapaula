import os
import dj_database_url
from pathlib import Path
from datetime import timedelta

EMAIL_SENDER = os.getenv('EMAIL_SENDER')
EMAIL_SENDER_PASSWORD = os.getenv('EMAIL_SENDER_PASSWORD')
SECRET_KEY = os.getenv('SECRET_KEY')
STRIPE_TEST_SECRET_KEY = os.getenv("STRIPE_TEST_SECRET_KEY")
STRIPE_TEST_PUBLISHABLE_KEY = os.getenv("STRIPE_TEST_PUBLISHABLE_KEY")

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = SECRET_KEY

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# For development, allow localhost and 127.0.0.1
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'websitedrapaula.onrender.com', 'websitedrapaula-frontend.onrender.com', 'paulaserranoeducacao.pt']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'api',
    'payment',
]

# REST Framework configuration for JWT authentication
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # Optional but recommended for added security
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),  # Access token valid for 60 minutes
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),     # Refresh token valid for 1 day
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be before CommonMiddleware for CORS
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases
DATABASES = {
    'default': dj_database_url.config(default=os.getenv('DATABASE_URL'))
}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings for React frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # React development server (Vite)
    "https://websitedrapaula-frontend.onrender.com",
    "https://paulaserranoeducacao.pt",
]

# For Email
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = EMAIL_SENDER
EMAIL_HOST_PASSWORD = EMAIL_SENDER_PASSWORD
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

CSRF_TRUSTED_ORIGINS = ['https://websitedrapaula.onrender.com', "https://paulaserranoeducacao.pt"]

STRIPE_ENDPOINT_SECRET = os.getenv('STRIPE_ENDPOINT_SECRET_TEST')

# For production, you will need to make the following changes:
# 1. Set DEBUG = False
# 2. Set ALLOWED_HOSTS to your domain, e.g., ['yourdomain.com', 'www.yourdomain.com']
# 3. Update CORS_ALLOWED_ORIGINS to your production frontend URL, e.g., ["https://yourfrontend.com"]
# 4. Generate a secure SECRET_KEY and store it in an environment variable
# 5. Switch to a production database like PostgreSQL
# 6. Configure static files with STATIC_ROOT and collectstatic
# 7. Enable HTTPS and set SECURE_SSL_REDIRECT, SESSION_COOKIE_SECURE, CSRF_COOKIE_SECURE
# 8. Consider adding logging and error reporting
# 9. Use a production WSGI server like Gunicorn
# Run `python manage.py check --deploy` to check for production readiness