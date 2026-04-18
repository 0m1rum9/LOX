from http import HTTPStatus
from typing import cast
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from category.models import Category
from category.serializers import CategorySerializer
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView

# TODO replace all the classes with ModelViewSet
class CategoryView(APIView):
    def get(self, request: Request) -> Response:
        return Response(
            CategorySerializer(Category.objects.all(), many=True).data,
            status=HTTPStatus.OK,
        )

    def post(self, request: Request) -> Response:
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            data = cast(dict[str, object], serializer.validated_data)
            parent_id = data.pop("parent_id")

            if parent_id is None:
                return Response(
                    CategorySerializer(Category.add_root(**data)).data,
                    status=HTTPStatus.CREATED,
                )
            else:
                parent = get_object_or_404(Category, id=parent_id)
                return Response(
                    CategorySerializer(parent.add_child(**data)).data,
                    status=HTTPStatus.CREATED,
                )
        return Response(serializer.errors, status=HTTPStatus.BAD_REQUEST)


class CategoryDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()

    serializer_class = CategorySerializer

    lookup_url_kwarg = "id"
    lookup_field = "id"


class SubCategoriesView(ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):

        return get_object_or_404(Category, id=self.kwargs["id"]).get_children()
