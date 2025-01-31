import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser, User
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken


@database_sync_to_async
def get_user_from_token(token):
    """Retrieve user from JWT token."""
    try:
        decoded_data = AccessToken(token)
        return User.objects.get(id=decoded_data["user_id"])
    except Exception as e:
        print(f"Invalid token: {e}")
        return AnonymousUser()


class NewsConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = AnonymousUser()

    async def connect(self):
        # Extract and validate token
        query_string = self.scope["query_string"].decode()

        token = None
        if "token=" in query_string:
            # Fix token extraction - split and get the correct part
            token = query_string.split("token=")[1].split("&")[0]

        if token:
            try:
                self.user = await get_user_from_token(token)
            except Exception as e:
                print("❌ Token validation error:", str(e))
                await self.close()
                return

        if self.user.is_authenticated:
            group_name = f"user_{self.user.id}"
            try:
                await self.channel_layer.group_add(group_name, self.channel_name)

                await self.accept()
            except Exception as e:
                print("❌ Group addition error:", str(e))
                await self.close()
        else:
            print("❌ User not authenticated")
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            group_name = f"user_{self.user.id}"
            try:
                await self.channel_layer.group_discard(group_name, self.channel_name)
            except Exception as e:
                print(f"Error during disconnect: {str(e)}")

    async def news_message(self, event):
        """Handles incoming news messages."""
        try:
            await self.send(text_data=json.dumps(event["news"]))
        except Exception as e:
            print(f"❌ Error sending news: {str(e)}")
