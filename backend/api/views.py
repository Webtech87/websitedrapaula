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
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from secret_files.secret_data import EMAIL_SENDER

# Imports for Google Drive and Sheets APIs
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.errors import HttpError
import os
import base64
from dotenv import load_dotenv

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

load_dotenv()

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

    def search_spreadsheet_by_name(self, service, spreadsheet_name="contacto_site"):
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
        sheet_id = self.search_spreadsheet_by_name(drive_service, 'contacto_site')
        
        if not sheet_id:
            #print("-------------Sheet not found, creating new one...")
            # If no sheet exists, create a new one using the Sheets API
            sheets_service = build('sheets', 'v4', credentials=credentials)
            spreadsheet = {
                'properties': {'title': 'contacto_site'}
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

    def add_data_to_sheet(self, sheet_id, data, sheet_name='Sheet1'):
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