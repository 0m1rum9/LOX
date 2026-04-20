from rest_framework import serializers

from attribute.models import Attribute, AttributeEnumValue


class AttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = "__all__"


class AttributeEnumValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeEnumValue
        fields = "__all__"
