from rest_framework import serializers
from rest_framework.fields import ListField
from category.models import Category
from attribute.models import Attribute


# TODO: make a validation for a subcategory not having parent category attributes
class CategorySerializer(serializers.ModelSerializer):
    parent_id = serializers.BigIntegerField(
        write_only=True, required=False, allow_null=True
    )

    class Meta:
        fields = ["id", "name", "path", "parent_id", "attributes"]
        model = Category
        read_only_fields = ["path", "depth"]


class CategoryTreeSerializer(serializers.Serializer):
    id = serializers.BigIntegerField()
    name = serializers.CharField()
    path = serializers.CharField()
    children = serializers.ListField()
