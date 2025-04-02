# payment/urls.py
from django.urls import path, include
from .views import payment_test, payment_canceled, payment_completed, stripe_webhook

app_name = 'payment'

urlpatterns = [
    path('', payment_test , name='payment'),  
    path('payment_completed/', payment_completed , name='payment_completed'),  
    path('payment_canceled/', payment_canceled , name='payment_canceled'),
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
]