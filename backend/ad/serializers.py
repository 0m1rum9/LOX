from decimal import Decimal
from django.db import transaction
from rest_framework import serializers

from ad.models import Ad, AdAttributeValue, Status
from attribute.models import Attribute, Type
from category.models import Category
from attribute.serializers import AttributeSerializer


class AdAttributeValueSerializer(serializers.ModelSerializer):
    attribute = AttributeSerializer()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        attr_type = data["attribute"]["type"]
        if attr_type == Type.NUMBER:
            data["value"] = Decimal(data["value_number"])
            data.pop("value_bool", None)
            data.pop("value_string", None)
            data.pop("value_date", None)
            data.pop("value_number")
        elif attr_type == Type.TEXT:
            data["value"] = data["value_string"]
            data.pop("value_bool", None)
            data.pop("value_string", None)
            data.pop("value_date", None)
            data.pop("value_number")
        elif attr_type == Type.BOOLEAN:
            data["value"] = data["value_bool"]
            data.pop("value_bool", None)
            data.pop("value_string", None)
            data.pop("value_date", None)
            data.pop("value_number")
        elif attr_type == Type.DATE:
            data["value"] = data["value_date"]
            data.pop("value_bool", None)
            data.pop("value_string", None)
            data.pop("value_date", None)
            data.pop("value_number")

        return data

    class Meta:
        model = AdAttributeValue
        fields = "__all__"


class AdSerializer(serializers.ModelSerializer):
    class Meta:
        fields = "__all__"
        model = Ad


class AdDetailSerializer(serializers.ModelSerializer):
    attributes_values = AdAttributeValueSerializer(many=True, read_only=True)

    class Meta:
        fields = "__all__"
        model = Ad


class AdAttributeValueCreateSerializer(serializers.Serializer):
    value_number = serializers.CharField(required=False, allow_null=True)
    value_text = serializers.CharField(max_length=256, allow_null=True, required=False)
    value_date = serializers.DateField(allow_null=True, required=False)
    value_bool = serializers.BooleanField(allow_null=True, required=False)
    attribute = serializers.PrimaryKeyRelatedField(queryset=Attribute.objects.all())

    def validate(self, attrs):
        # TODO: add validation for value type <-> attribute type
        self.validate_value_fields(attrs)
        return attrs

    def validate_value_fields(self, attrs):
        """
        Check that at most one of the value fields is given and not null
        """
        value_fields = [
            attrs.get("value_number"),
            attrs.get("value_date"),
            attrs.get("value_bool"),
            attrs.get("value_text"),
        ]

        filled = sum(v is not None for v in value_fields)

        if filled > 1:
            raise serializers.ValidationError(
                "At most one value field must be provided"
            )


class AdCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=512)
    description = serializers.CharField()
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    attributes_values = AdAttributeValueCreateSerializer(
        many=True, required=False, allow_null=True
    )
    photo = serializers.URLField(required=True)

    def validate(self, attrs):
        self.validate_category_attributes(attrs)
        return attrs

    def validate_category_attributes(self, attrs):
        """
        Method for validating whether the user inputed attribute ids are in ad's category attributes
        """
        category = attrs.get("category")
        categories = list(category.get_ancestors()) + [category]
        allowed_attribute_ids = []
        for ctg in categories:
            allowed_attribute_ids.extend(
                ctg.attributes.all().values_list("id", flat=True)
            )

        for attribute_value in attrs.get("attributes_values"):
            if attribute_value.get("attribute").id not in allowed_attribute_ids:
                raise serializers.ValidationError(
                    "this attribute is not in category attributes"
                )
        return attrs

    def create(self, validated_data):
        attr_values = validated_data.pop("attributes_values", None)
        validated_data["status"] = Status.active
        with transaction.atomic():
            ad = Ad.objects.create(**validated_data)
            AdAttributeValue.objects.bulk_create(
                [AdAttributeValue(ad=ad, **attr) for attr in attr_values]
            )
            return ad

    def update(self, instance, validated_data):
        attr_values = validated_data.pop("attributes_values", None)
        with transaction.atomic():
            Ad.objects.update(**validated_data)
            return instance
