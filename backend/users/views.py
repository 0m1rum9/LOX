from rest_framework.decorators import api_view, permission_classes

from http import HTTPMethod, HTTPStatus

from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from users.models import User
from users.serializers import UserSerializer


@api_view(http_method_names=[HTTPMethod.POST])
def register(request: Request) -> Response:
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        return Response(
            UserSerializer(serializer.save()).data, status=HTTPStatus.CREATED
        )

    return Response(serializer.errors, status=HTTPStatus.BAD_REQUEST)


@api_view(http_method_names=[HTTPMethod.GET])
@permission_classes([IsAuthenticated])
def get_user(request: Request, id: int) -> Response:
    return Response(UserSerializer(User.objects.get(id=id)).data, status=HTTPStatus.OK)
