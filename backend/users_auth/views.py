from http import HTTPMethod, HTTPStatus

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view
from users.serializers import UserSerializer


@api_view(http_method_names=[HTTPMethod.POST])
def register(request: Request) -> Response:
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        return Response(
            UserSerializer(serializer.save()).data, status=HTTPStatus.CREATED
        )

    return Response(serializer.errors, status=HTTPStatus.BAD_REQUEST)
