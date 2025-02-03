from django.db import models
from django.contrib.auth.models import User


class News(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_news")
    receivers = models.ManyToManyField(
        User, related_name="received_news", blank=True, null=True
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    published_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"News from {self.sender.username}"

    class Meta:
        ordering = ["-id"]
