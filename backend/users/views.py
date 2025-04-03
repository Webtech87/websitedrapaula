from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.sites.shortcuts import get_current_site
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, LoginSerializer, CustomUserSerializer
from .models import CustomUser
from rest_framework import serializers  # Import serializers
import logging

# For Email
from django.core.mail import EmailMultiAlternatives

# Imports for Google Drive and Sheets APIs
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.errors import HttpError
import os
import base64
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv()

SITE_DOMAIN = os.getenv('SITE_DOMAIN')

User = get_user_model()

def activation_sended(request):
    """Render activation sent confirmation page"""
    return render(request, 'users/activation/sent.html')  # Updated template path

def send_activate_link_by_email(user, request):
    """
    Send account activation email with secure token
    """
    current_site = get_current_site(request)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    activation_link = f"{getattr(settings, 'SITE_DOMAIN', 'https://websitedrapaula.onrender.com')}{reverse('users:confirm', kwargs={'uidb64': uid, 'token': token})}"

    context = {
        'user': user,
        'domain': current_site.domain,
        'activation_link': activation_link
    }
    
    send_mail(
        subject="Activate Your Account",
        message=f"Click the link to activate your account: {activation_link}",
        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com'),
        recipient_list=[user.email],
        html_message=render_to_string('users/activation/email.html', context)  # Updated template path
    )

class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT token obtain view with cookie support"""
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            res = Response({
                'success': True,
                'user': {
                    'id': response.data.get('user_id', None),
                    'email': request.user.email if request.user.is_authenticated else None
                }
            })
            res.set_cookie(
                key="access_token",
                value=tokens['access'],
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path="/",
                max_age=3600  # 1 hour
            )
            res.set_cookie(
                key="refresh_token",
                value=tokens['refresh'],
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path="/",
                max_age=86400  # 1 day
            )
            return res
        except Exception as e:
            logger.error(f"Token obtain error: {str(e)}")
            return Response(
                {'success': False, 'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class CustomTokenRefreshView(TokenRefreshView):
    """Custom JWT token refresh view"""
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token') or request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'refreshed': False, 'error': 'Refresh token missing'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            
            res = Response({'refreshed': True})
            res.set_cookie(
                key="access_token",
                value=response.data['access'],
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path="/",
                max_age=3600  # 1 hour
            )
            return res
        except Exception as e:
            logger.error(f"Token refresh error: {str(e)}")
            return Response(
                {'refreshed': False, 'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current authenticated user data"""
    serializer = UserSerializer(request.user)
    return Response({
        'success': True,
        'user': serializer.data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout by clearing JWT cookies"""
    response = Response({'success': True})
    response.delete_cookie('access_token', path='/')
    response.delete_cookie('refresh_token', path='/')
    return response

class RegisterView(APIView):
    permission_classes = []  # Allow unauthenticated access

    def post(self, request):
        data = request.data
        if not data.get('accept_terms'):
            return Response({"error": "You must accept the terms and conditions."}, status=400)
        serializer = UserSerializer(data=request.data)  # Use UserSerializer here
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """User profile management endpoint"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Always return the currently authenticated user"""
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        """Custom retrieve to ensure consistent response format"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'user': {
                'full_name': instance.full_name,  # Direct field access
                'email': instance.email,
                # Include other important fields
                **serializer.data
            }
        })

    def update(self, request, *args, **kwargs):
        """Handle profile updates with proper validation"""
        try:
            # Partial update allowed for PATCH requests
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            
            # Remove read-only fields from request data
            request_data = request.data.copy()
            for field in ['email', 'id']:  # Add other read-only fields
                if field in request_data:
                    del request_data[field]
            
            serializer = self.get_serializer(
                instance, 
                data=request_data, 
                partial=partial
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            return Response({
                'success': True,
                'user': {
                    'full_name': instance.full_name,
                    'email': instance.email,
                    **serializer.data
                }
            })
            
        except serializers.ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return Response(
                {'success': False, 'error': e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Profile update error: {str(e)}")
            return Response(
                {'success': False, 'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class PasswordResetRequestView(generics.GenericAPIView):
    """Custom password reset request view"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Implement your password reset logic here
        return Response({'success': True, 'message': 'Password reset email sent'})

class PasswordResetConfirmView(generics.GenericAPIView):
    """Custom password reset confirmation view"""
    permission_classes = [AllowAny]
    
    def post(self, request, uidb64, token):
        # Implement your password reset confirmation logic here
        return Response({'success': True, 'message': 'Password reset successful'})

@login_required
def user_profile(request):
    user = request.user
    return JsonResponse({
        "full_name": user.get_full_name(),
        "email": user.email,
    })


EMAIL_SENDER = os.getenv('EMAIL_SENDER')
CLIENT_SECRET_BASE64 = os.getenv('CLIENT_SECRET_BASE64')

# Decode the base64 string and write the content to a temporary file
decoded_credentials = base64.b64decode(CLIENT_SECRET_BASE64)
secret_file_path = '/tmp/secret_files/service_key.json'

# Ensure the directory exists
os.makedirs(os.path.dirname(secret_file_path), exist_ok=True)

with open(secret_file_path, 'wb') as f:
    f.write(decoded_credentials)

SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']

class EmailSenderView(APIView):
    permission_classes = [AllowAny]

    # Get credentials
    def get_credentials(self):
        credentials = service_account.Credentials.from_service_account_file(secret_file_path, scopes=SCOPES)

        return credentials

    def search_spreadsheet_by_name(self, service, spreadsheet_name="Contactos Site"):
        # Search for a sheet by name in Google Drive.
        query = f"name = '{spreadsheet_name}' and mimeType = 'application/vnd.google-apps.spreadsheet'"
        results = service.files().list(q=query, fields="files(id, name)").execute()
        spreadsheets = results.get('files', [])
        
        if spreadsheets:
            return spreadsheets[0]['id']  # Return the first sheet's ID found
        else:
            return None  # No sheet found
        
    def share_sheet_with_email(self, sheet_id, email=EMAIL_SENDER):
        # Share the sheet with a Google account
        credentials = self.get_credentials()
        drive_service = build('drive', 'v3', credentials=credentials)

        permission = {
            'type': 'user',
            'role': 'writer',  # Use 'writer' for edit access, 'reader' for view access
            'emailAddress': email
        }

        # Apply the permission (share the sheet)
        drive_service.permissions().create(
            fileId=sheet_id,
            body=permission,
            sendNotificationEmail=False  # Change to True if you want an email notification
        ).execute()

        
        #print(f'------------Sheet shared with {email}')

    # Create a new sheet if it doesn't exist, or return the existing sheet's ID.
    def create_or_get_sheet(self, sheet_name='Sheet1'):
        print("-------------Entering create_or_get_sheet method...")
        credentials = self.get_credentials()

        # First, use the Drive API to check for an existing sheet
        drive_service = build('drive', 'v3', credentials=credentials)
        sheet_id = self.search_spreadsheet_by_name(drive_service, 'Contactos Site')
        
        if not sheet_id:
            #print("-------------Sheet not found, creating new one...")
            # If no sheet exists, create a new one using the Sheets API
            sheets_service = build('sheets', 'v4', credentials=credentials)
            spreadsheet = {
                'properties': {'title': 'Contactos Site'}
            }
            sheet = sheets_service.spreadsheets().create(body=spreadsheet, fields='spreadsheetId').execute()
            sheet_id = sheet['spreadsheetId']

            # Define the headers to insert into the first row
            headers = ["Nome", "Email", "Assunto", "Mensagem"]

            # Prepare the request body to update the first row with headers
            body = {'values': [headers]}

            # Update the first row with headers
            range_ = f'{sheet_name}!A1:D1'
            sheets_service.spreadsheets().values().update(
                spreadsheetId=sheet_id,
                range=range_,
                valueInputOption='RAW',  # Use 'RAW' if you just want the raw data inserted, 'USER_ENTERED' for Google Sheets functions
                body=body
            ).execute()

            self.share_sheet_with_email(sheet_id)

            # Wait for the sheet to be fully created and populated
            #print(f"----------------Headers inserted into sheet: {sheet_name}")

        else:
            '''
            Print for troubleshooting
            print(f"Sheet '{sheet_name}' already exists with ID: {sheet_id}")
            '''
            print(f"---------------Sheet '{sheet_name}' already exists with ID: {sheet_id}")
            self.share_sheet_with_email(sheet_id)

        return sheet_id
    
    def rename_sheet(self, sheet_id, new_name="Contactos"):
        """Rename the default 'Sheet1' to a new name."""
        credentials = self.get_credentials()
        sheets_service = build("sheets", "v4", credentials=credentials)

        # Get the sheet ID of "Sheet1"
        sheet_metadata = sheets_service.spreadsheets().get(spreadsheetId=sheet_id).execute()
        sheets = sheet_metadata.get("sheets", [])
        
        if not sheets:
            print("No sheets found in the spreadsheet.")
            return

        sheet1_id = sheets[0]["properties"]["sheetId"]  # Get the first sheet's ID
        current_name = sheets[0]["properties"]["title"]  # Get the sheet's current name

        if current_name == new_name:  # If already renamed, do nothing
            print(f"Sheet is already named '{new_name}', skipping rename.")
            return

        # Request to rename the sheet
        batch_update_request = {
            "requests": [
                {
                    "updateSheetProperties": {
                        "properties": {
                            "sheetId": sheet1_id,
                            "title": new_name,
                        },
                        "fields": "title",
                    }
                }
            ]
        }

        try:
            sheets_service.spreadsheets().batchUpdate(
                spreadsheetId=sheet_id, body=batch_update_request
            ).execute()
            print(f"Sheet renamed to '{new_name}' successfully.")
        except Exception as e:
            print(f"Error renaming sheet: {e}")

    def add_data_to_sheet(self, sheet_id, data, sheet_name='Contactos'):
        # Append data to the given Google Sheet.
        credentials = self.get_credentials()
        service = build('sheets', 'v4', credentials=credentials)

        # Prepare data to be added (extract values from 'data' dictionary)
        values = [data.get('full_name'), data.get('email'), data.get('subject'), data.get('message')]
        
        # Prepare data to be added
        body = {'values': [values]}

        range_ = f'{sheet_name}'

        # Append data to the first sheet in the document
        service.spreadsheets().values().append(
            spreadsheetId=sheet_id,
            range=range_,  # Adjust this range if needed
            valueInputOption='RAW',  # Ensure rows are added, not overwritten
            insertDataOption='INSERT_ROWS',
            body=body
        ).execute()

    #USE TO DELETE A GOOGLE SHEETS FILE PROGRAMATICALLY
        
    def delete_file(self, file_id="1P-P_ynQ8JTNjeimLRiF7UyqkB-MA34BZKEc_UfJKNJY"):
        credentials = self.get_credentials()

        # Build the drive service
        drive_service = build('drive', 'v3', credentials=credentials)

        try:
            # Delete the file using the fileId
            drive_service.files().delete(fileId=file_id).execute()
            print(f"File with ID {file_id} deleted successfully.")
        except Exception as e:
            print(f"An error occurred while deleting the file: {e}")
            

    def post(self, request, *args, **kwargs): #need to override the post method of APIView, not create a custom method like send_contact_email
        if request.method == 'POST':
            try:
                data = request.data
                
                full_name = data.get('full_name')
                email = data.get('email')
                subject = data.get('subject', None) # Default to None if not provided
                message = data.get('message')

                # Validate data (basic check)
                if not all([full_name, email, message]):
                    return Response({'error': 'Missing required fields'}, status=400)
                
                try:
                    # Create or retrieve the sheet and append data
                    sheet_id = self.create_or_get_sheet()
                    self.rename_sheet(sheet_id)
                    self.add_data_to_sheet(sheet_id, {'full_name': full_name, 'email': email, 'subject': subject, 'message': message})
                except Exception as e:
                    print(f"An error occurred with Google Sheets: {e}")

                email_subject = "Novo Formulário Preenchido"

                # Construct email body
                email_body = f"Nome: {full_name}\nEmail: {email}\n"
                if subject:  # Only add subject if it exists
                    email_body += f"Assunto: {subject}\n"
                email_body += f"Mensagem: {message}"

                email_msg = EmailMultiAlternatives(
                    subject=email_subject,
                    body=email_body,  # Remove extra spaces if subject is missing
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