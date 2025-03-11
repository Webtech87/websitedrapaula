# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from django.db import transaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['full_name', 'age', 'gender', 'phone', 'birth_date', 'country']

class RegisterSerializer(serializers.Serializer):
    user = UserSerializer()
    profile = UserProfileSerializer()

    def create(self, validated_data):
        user_data = validated_data['user']  # Extract nested user data
        profile_data = validated_data['profile']  # Extract nested profile data
        with transaction.atomic():
            user = UserSerializer().create(user_data)  # Create the user
            UserProfile.objects.create(user=user, **profile_data)  # Create the profile
        return user