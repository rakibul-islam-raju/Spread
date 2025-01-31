from rest_framework import serializers
from .models import News


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
        return {
            "full_name": f"{obj.sender.first_name} {obj.sender.last_name}",
            "username": obj.sender.username,
        }
