"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from http import HTTPMethod
from users.urls import urlpatterns as users_urls


@api_view(http_method_names=[HTTPMethod.GET])
@permission_classes([IsAuthenticated])
def test_view(req) -> Response:
    return Response({"message": "hello world"}, status=200)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include(users_urls)),
]
