from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter


from news.views import NewsViewSet

router = DefaultRouter()
router.register(r"news", NewsViewSet, basename="news")


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    #     news
    path("api/news/", NewsViewSet.as_view({"get": "list", "post": "create"})),
]
