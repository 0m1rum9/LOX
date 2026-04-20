from http import HTTPMethod, HTTPStatus
from typing import cast
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from category.models import Category
from category.serializers import CategorySerializer, CategoryTreeSerializer
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from attribute.serializers import AttributeSerializer


# TODO replace all the classes with ModelViewSet
class CategoryView(APIView):
    def get_permissions(self):
        if self.request.method == HTTPMethod.POST:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request: Request) -> Response:
        def build_tree(nodes):
            tree = []
            stack = []

            for node in nodes:
                item = {
                    "id": node.id,
                    "path": node.path,
                    "name": node.name,
                    "children": [],
                }

                while stack and stack[-1]["depth"] >= node.depth:
                    stack.pop()

                if stack:
                    stack[-1]["node"]["children"].append(item)
                else:
                    tree.append(item)

                stack.append({"depth": node.depth, "node": item})

            return tree

        return Response(
            CategoryTreeSerializer(build_tree(Category.get_tree()), many=True).data,
            status=HTTPStatus.OK,
        )

    def post(self, request: Request) -> Response:
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            data = cast(dict[str, object], serializer.validated_data)
            parent_id = data.pop("parent_id", None)

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
    def get_permissions(self):
        if self.request.method in [HTTPMethod.PUT, HTTPMethod.DELETE, HTTPMethod.PATCH]:
            return [IsAuthenticated()]
        return [AllowAny()]

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    lookup_url_kwarg = "id"
    lookup_field = "id"

    def retrieve(self, request, *args, **kwargs):
        category = self.get_object()
        data = CategorySerializer(category).data
        data["attributes"] = AttributeSerializer(
            get_category_with_attributes(category), many=True
        ).data
        data["children"] = CategorySerializer(category.get_children(), many=True).data

        return Response(data)


def get_category_with_attributes(category):
    categories = list(category.get_ancestors()) + [category]

    attributes = []
    for ctg in categories:
        attributes.extend(ctg.attributes.all())

    return attributes
