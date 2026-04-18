from rest_framework import serializers
from category.models import Category


class CategorySerializer(serializers.ModelSerializer):
    parent_id = serializers.BigIntegerField(write_only=True, required=False)

    class Meta:
        # fields = ["name", "path", ]
        fields = ["id", "name", "path", "parent_id"]
        model = Category
        read_only_fields = ["path", "depth"]
