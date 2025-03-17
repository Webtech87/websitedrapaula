# api/models.py
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    phone = models.CharField(max_length=20)
    birth_date = models.DateField()
    country = models.CharField(max_length=50)


class Document(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=[('artigo', 'Artigo'), ('tese', 'Tese')])
    date = models.DateField()
    description = models.TextField()
    file = models.FileField(upload_to='documents/')

    def __str__(self):
        return self.title