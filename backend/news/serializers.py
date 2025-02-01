from django.contrib.auth.models import User
from rest_framework import serializers
from .models import News


# User list serializer
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "username"]


# News create serializer
class CreateNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ["receivers", "message"]


# News list serializer
class NewsListSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    send_to_all = serializers.BooleanField(default=False)

    class Meta:
        model = News
        exclude = ["sender", "message", "is_read", "published_at", "send_to_all"]

    def get_sender(self, obj):
        return {
            "full_name": f"{obj.sender.first_name} {obj.sender.last_name}",
            "username": obj.sender.username,
        }
