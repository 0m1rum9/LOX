from django.shortcuts import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from ad.models import Ad, Status
from ad.serializers import (
    AdCreateSerializer,
    AdDetailSerializer,
    AdSerializer,
)

from http import HTTPMethod, HTTPStatus
from rest_framework.permissions import AllowAny, IsAuthenticated


class AdListView(APIView):
    def get_permissions(self):
        if self.request.method == HTTPMethod.POST:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request: Request) -> Response:
        return Response(
            AdSerializer(Ad.objects.filter(status=Status.active).all(), many=True).data,
            status=HTTPStatus.OK,
        )

    def post(self, request: Request) -> Response:
        serializer = AdCreateSerializer(data=request.data)
        if serializer.is_valid():
            return Response(
                AdSerializer(serializer.save(user=request.user)).data,
                status=HTTPStatus.CREATED,
            )

        return Response(serializer.errors, status=HTTPStatus.BAD_REQUEST)


class AdDetailView(APIView):
    def get_permissions(self):
        if self.request.method in [HTTPMethod.PUT, HTTPMethod.DELETE]:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request: Request, id: int) -> Response:
        return Response(
            AdDetailSerializer(
                get_object_or_404(
                    Ad.objects.prefetch_related("attributes_values"), id=id
                )
            ).data
        )

    def put(self, request: Request, id: int) -> Response:
        serializer = AdCreateSerializer(get_object_or_404(Ad, id=id), data=request.data)

        serializer.is_valid(raise_exception=True)
        return Response(
            AdSerializer(serializer.save(user=request.user)).data,
            status=HTTPStatus.OK,
        )

    def delete(self, request: Request, id: int) -> Response:
        get_object_or_404(Ad, id=id).delete()

        return Response(status=HTTPStatus.OK)
