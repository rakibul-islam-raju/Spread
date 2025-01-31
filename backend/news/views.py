from rest_framework import viewsets
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import News
from .serializers import CreateNewsSerializer, NewsListSerializer


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
        if receivers:
            news.receivers.set(receivers)  # Use set() instead of add()

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
