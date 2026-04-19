from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes

from http import HTTPMethod, HTTPStatus

from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from user.models import User
from user.serializers import UserSerializer


@api_view(http_method_names=[HTTPMethod.GET])
@permission_classes([IsAuthenticated])
def get_user(request: Request, id: int) -> Response:
    return Response(
        UserSerializer(get_object_or_404(User, id=id)).data, status=HTTPStatus.OK
    )
