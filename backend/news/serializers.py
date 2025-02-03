from django.contrib.auth.models import User
from rest_framework import serializers
from .models import News


# User list serializer
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "username"]


# News create serializer
class CreateNewsSerializer(serializers.ModelSerializer):
    send_to_all = serializers.BooleanField(default=False)

    class Meta:
        model = News
        fields = ["receivers", "message", "send_to_all"]

    def create(self, validated_data):
        send_to_all = validated_data.pop("send_to_all", False)
        receivers = validated_data.pop("receivers", [])

        # Create news instance
        news = News.objects.create(**validated_data)

        if send_to_all:
            receivers = User.objects.filter(is_active=True)

        news.receivers.set(receivers)

        return news


# News list serializer
class NewsListSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()

    class Meta:
        model = News
        exclude = ["receivers"]

    def get_sender(self, obj):
        return {
            "full_name": f"{obj.sender.first_name} {obj.sender.last_name}",
            "username": obj.sender.username,
        }
