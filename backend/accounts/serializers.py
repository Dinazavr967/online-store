from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer

class CustomRegisterSerializer(RegisterSerializer):
    # Убираем username из обязательных полей для фронтенда
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def custom_signup(self, request, user):
        # Автоматически заполняем служебное поле username значением до @ из email
        if not user.username:
            user.username = user.email.split('@')[0]
        user.save()
        return user