from rest_framework import viewsets, generics
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User

from .models import News
from .serializers import UserListSerializer, CreateNewsSerializer, NewsListSerializer


class UserListView(generics.ListAPIView):
    serializer_class = UserListSerializer

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id)


class NewsViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return News.objects.filter(receivers=self.request.user)

    def get_serializer_class(self):
        if self.action == "list":
            return NewsListSerializer
        return CreateNewsSerializer

    def perform_create(self, serializer):
        # Save news instance with sender
        news = serializer.save(sender=self.request.user)

        # Manually set receivers (Many-to-Many field)
        receivers = serializer.validated_data.get("receivers", [])
        to_all = serializer.validated_data.get("send_to_all", False)

        if to_all:
            receivers = User.objects.exclude(username=self.request.user.username)

        if receivers:
            news.receivers.set(receivers)

        # Broadcast news
        self.broadcast_news(news)

    def broadcast_news(self, news):
        try:
            channel_layer = get_channel_layer()

            news_data = NewsListSerializer(news).data

            for receiver in news.receivers.all():
                group_name = f"user_{receiver.id}"

                message = {"type": "news_message", "news": news_data}

                async_to_sync(channel_layer.group_send)(group_name, message)

        except Exception as e:
            print(f"❌ Error in broadcast_news: {str(e)}")
            raise e
