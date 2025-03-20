# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, UserProfileSerializer
from django.contrib.auth.models import User
from .models import UserProfile, Document
from .serializers import DocumentSerializer
from rest_framework import generics
from .models import Document  # Assuming you have a Document model
from . import serializers  # Import the serializers module

import stripe
from secret_files.secret_data import STRIPE_SECRET_KEY

class DocumentList(generics.ListAPIView):
    queryset = Document.objects.all()
    serializer_class = serializers.DocumentSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            profile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
stripe.api_key = STRIPE_SECRET_KEY
        
class CreateCheckoutSession(APIView):
    permission_classes = [AllowAny]  # Allow all users (no authentication required) only for test

    def post(self, request, *args, **kwargs):
        try:
            # Get the data from the request body
            data = request.data  # request.data automatically parses JSON data in DRF

            # Assuming you're sending course ID and other necessary data from frontend
            course_id = data.get('courseId')

            # Simulating retrieving the course data from the database
            course_data = {
                "id": course_id,
                "price": 24999,  # Price in cents
                "name": "Raciocinio clinico e intervencao em integracao sensorial nos primeiros anos de vida",
                "image_url": "https://example.com/course-image.jpg",  # Replace with actual image URL
            }

            # Create Stripe Checkout session
            checkout_session = stripe.checkout.Session.create(
                line_items=[{
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': course_data['name'],
                            'images': [course_data['image_url']],  # Image URL in list
                        },
                        'unit_amount': course_data['price'],  # Price in cents
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url='http://localhost:8000/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:8000/cancel',
                metadata={'course_id': course_data['id']},  # Store course ID in metadata
            )

            return Response({'id': checkout_session.id}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)