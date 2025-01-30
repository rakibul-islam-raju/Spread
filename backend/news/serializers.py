from rest_framework import serializers
from .models import News
from django.contrib.auth.models import User


class CreateNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ["receivers", "message"]


class NewsListSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()

    class Meta:
        model = News
        exclude = ["receivers"]

    def get_sender(self, obj):
        return {"full_name": obj.sender.first_name, "username": obj.sender.username}
