# api/urls.py
from django.urls import path
from .views import RegisterView, UserProfileView, EmailSenderView
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import path, re_path
from . import views
from .views import DocumentList

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  # Registration endpoint
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),  # Profile endpoint
    path('api/documents/', DocumentList.as_view(), name='document-list'),
    path('send_contact_email/', EmailSenderView.as_view(), name='send_contact_email'),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

