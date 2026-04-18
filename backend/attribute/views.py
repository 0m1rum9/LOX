from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.decorators import api_view


from attribute.models import Attribute, AttributeEnumValue, Type
from attribute.serializers import AttributeEnumValueSerializer, AttributeSerializer

from http import HTTPMethod, HTTPStatus


class AttributeListView(APIView):
    def get(self, request: Request) -> Response:
        return Response(
            AttributeSerializer(Attribute.objects.all(), many=True).data,
            status=HTTPStatus.OK,
        )

    def post(self, request: Request) -> Response:
        serializer = AttributeSerializer(data=request.data)

        if serializer.is_valid():
            return Response(
                AttributeSerializer(serializer.save()).data, status=HTTPStatus.CREATED
            )

        return Response(serializer.errors, HTTPStatus.BAD_REQUEST)


class AttributeDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = AttributeSerializer
    lookup_url_kwarg = "id"
    lookup_field = "id"
    queryset = Attribute.objects.all()


class AttributeEnumValueListView(ListCreateAPIView):
    queryset = AttributeEnumValue.objects.all()
    serializer_class = AttributeEnumValueSerializer


class AttributeEnumValueDetailView(RetrieveUpdateDestroyAPIView):
    queryset = AttributeEnumValue.objects.all()
    lookup_field = "id"
    lookup_url_kwarg = "id"
    serializer_class = AttributeEnumValueSerializer


@api_view(http_method_names=[HTTPMethod.GET])
def attribute_enum_values(request: Request, id: int) -> Response:
    return Response(
        AttributeEnumValueSerializer(get_object_or_404(AttributeEnumValue, id=id)).data,
        status=HTTPStatus.OK,
    )


@api_view(http_method_names=[HTTPMethod.GET])
def attribute_types(request: Request) -> Response:
    return Response(Type.values)
