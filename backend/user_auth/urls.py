from django.urls import path
from rest_framework_simplejwt.views import (
    TokenBlacklistView,
    TokenObtainPairView,
    TokenRefreshView,
)
from user_auth.views import register


urlpatterns = [
    path("register/", view=register, name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("logout/", TokenBlacklistView.as_view(), name="logout"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
