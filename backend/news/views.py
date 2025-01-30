from rest_framework import viewsets
from rest_framework.response import Response

from .models import News
from .serializers import CreateNewsSerializer, NewsListSerializer


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return NewsListSerializer
        elif self.action == "create":
            return CreateNewsSerializer
        return CreateNewsSerializer  # Default fallback

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer_class()(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
