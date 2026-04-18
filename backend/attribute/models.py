from django.db import models


class Type(models.TextChoices):
    TEXT = "text"
    BOOLEAN = "boolean"
    ENUM = "enum"
    DATE = "date"
    NUMBER = "number"


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
        max_length=20,
        verbose_name="type of attribute: {text, number, enum, date, boolean}",
        null=False,
        choices=Type.choices,
    )

    class Meta:
        constraints = [
            models.constraints.CheckConstraint(
                condition=models.Q(type__in=[t.value for t in Type]),
                name="type_valid",
            )
        ]


class AttributeEnumValue(models.Model):
    code = models.CharField(max_length=256, unique=True, null=False)
    label = models.CharField(max_length=256, null=False)
    attribute = models.ForeignKey(to=Attribute, on_delete=models.CASCADE)
