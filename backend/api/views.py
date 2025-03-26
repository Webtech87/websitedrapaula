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

# For Email
from django.core.mail import EmailMultiAlternatives
import logging
import os

EMAIL_SENDER = os.getenv('EMAIL_SENDER')

# Get your email sender details from settings
from django.conf import settings

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
        
# Email
logger = logging.getLogger(__name__)

class EmailSenderView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs): #need to override the post method of APIView, not create a custom method like send_contact_email
        if request.method == 'POST':
            try:
                data = request.data
                
                full_name = data.get('full_name')
                email = data.get('email')
                subject = data.get('subject')
                message = data.get('message')

                # Validate data (basic check)
                if not all([full_name, email, subject, message]):
                    return Response({'error': 'Missing required fields'}, status=400)

                email_subject = 'Novo Formulário Preenchido'
                email_body = f"""
                Nome: {full_name}
                Email: {email}
                Assunto: {subject}
                Mensagem: {message}
                """

                email_msg = EmailMultiAlternatives(
                    subject=email_subject,
                    body=email_body,
                    from_email=EMAIL_SENDER,
                    to=[EMAIL_SENDER],
                    reply_to=[email]  # Reply-to user
                )

                email_msg.send(fail_silently=False)

                return Response({'success': 'Email enviado com sucesso!'})

            except Exception as e:
                logger.error(f"Email sending failed: {e}")
                return Response({'error': 'Falha ao enviar email'}, status=500)

        return Response({'error': 'Método não permitido'}, status=405)