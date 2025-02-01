import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser, User
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken

from .models import News


@database_sync_to_async
def get_user_from_token(token):
    """Retrieve user from JWT token."""
    try:
        decoded_data = AccessToken(token)
        return User.objects.get(id=decoded_data["user_id"])
    except Exception as e:
        print(f"Invalid token: {e}")
        return AnonymousUser()


@database_sync_to_async
def mark_all_news_as_read(receiver):
    """Mark all unread notifications for a user as read."""
    News.objects.filter(receivers=receiver, is_read=False).update(is_read=True)


@database_sync_to_async
def mark_single_news_as_read(receiver, news_id):
    """Mark a single notification as read."""
    try:
        news = News.objects.get(id=news_id, receivers=receiver)
        news.is_read = True
        news.save()
        return {"id": news.id, "status": "read"}
    except News.DoesNotExist:
        return None


class NewsConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = AnonymousUser()

    async def connect(self):
        query_string = self.scope["query_string"].decode()
        token = (
            query_string.split("token=")[1].split("&")[0]
            if "token=" in query_string
            else None
        )

        if token:
            self.user = await get_user_from_token(token)

        if self.user.is_authenticated:
            group_name = f"user_{self.user.id}"
            await self.channel_layer.group_add(group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            group_name = f"user_{self.user.id}"
            try:
                await self.channel_layer.group_discard(group_name, self.channel_name)
            except Exception as e:
                print(f"Error during disconnect: {str(e)}")

    async def receive(self, text_data):
        """Handle incoming messages from the WebSocket."""
        data = json.loads(text_data)
        action = data.get("action")

        if action == "mark_all_as_read" and self.user.is_authenticated:
            await mark_all_news_as_read(self.user)
            await self.send(
                text_data=json.dumps(
                    {
                        "type": action,
                        "status": "success",
                        "message": "All news marked as read.",
                    }
                )
            )
        elif action == "mark_as_read" and self.user.is_authenticated:
            news_id = data.get("news_id")
            if news_id:
                news = await mark_single_news_as_read(self.user, news_id)
                if news:
                    await self.send(
                        text_data=json.dumps(
                            {
                                "type": action,
                                "data": news,
                                "status": "success",
                                "message": "News marked as read",
                            }
                        )
                    )
                else:
                    await self.send(
                        text_data=json.dumps(
                            {
                                "type": action,
                                "status": "error",
                                "message": "Notification not found or unauthorized.",
                            }
                        )
                    )

    async def news_message(self, event):
        """Handles incoming news messages."""
        data = {
            "type": event["type"],
            "data": event["news"],
            "status": "success",
            "message": "New news received",
        }
        print("==>", json.dumps(data))
        try:
            await self.send(text_data=json.dumps(data))
        except Exception as e:
            print(f"❌ Error sending news: {str(e)}")
