import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

User = get_user_model()


class NewsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        if self.user.is_authenticated:
            # Add user to their personal group
            await self.channel_layer.group_add(
                f"user_{self.user.id}", self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            # Remove user from their group
            await self.channel_layer.group_discard(
                f"user_{self.user.id}", self.channel_name
            )

    async def news_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event["news"]))
