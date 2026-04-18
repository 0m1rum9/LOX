from django.db import models


class Attribute(models.Model):
    code = models.CharField(
        max_length=256,
        verbose_name="immutable name for service purposes",
        unique=True,
        null=False,
    )
    label = models.CharField(
        max_length=256, verbose_name="human readable name", null=False
    )

    type = models.CharField(
        max_length=30,
        verbose_name="type of attribute: {text, number, enum, date, boolean}",
        null=False,
    )


class AttributeEnumValue(models.Model):
    code = models.CharField(max_length=256, unique=True, null=False)
    label = models.CharField(max_length=256, null=False)
    attribute = models.ForeignKey(to=Attribute, on_delete=models.CASCADE)
