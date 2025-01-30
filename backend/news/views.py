from rest_framework import viewsets
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import News
from .serializers import CreateNewsSerializer, NewsListSerializer


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return NewsListSerializer
        return CreateNewsSerializer

    def perform_create(self, serializer):
        # Save the news with sender
        news = serializer.save(sender=self.request.user)

        # Broadcast to receivers
        self.broadcast_news(news)

    def broadcast_news(self, news):
        # Get channel layer
        channel_layer = get_channel_layer()

        # Serialize news for broadcasting
        news_data = NewsListSerializer(news).data

        # Broadcast to each receiver
        for receiver in news.receivers.all():
            async_to_sync(channel_layer.group_send)(
                f"user_{receiver.id}",
                {
                    "type": "news_message",
                    "news": {"type": "news_message", "data": news_data},
                },
            )
