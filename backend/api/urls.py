# api/urls.py
from django.urls import path
from .views import RegisterView, UserProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  # Registration endpoint
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),  # Profile endpoint
]