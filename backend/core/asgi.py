import os

# Set DJANGO_SETTINGS_MODULE before importing Django stuff
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

import django

django.setup()  # 🔥 This initializes Django before importing models

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import re_path
from news.consumers import NewsConsumer

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(
                URLRouter(
                    [
                        re_path(r"ws/news/$", NewsConsumer.as_asgi()),
                    ]
                )
            )
        ),
    }
)
