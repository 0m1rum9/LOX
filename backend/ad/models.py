from django.db import models
from attribute.models import Attribute
from category.models import Category
from user.models import User


class Status(models.TextChoices):
    active = "active", "Active"
    deactivated = "deactivated", "Deactivated"


class Ad(models.Model):
    title = models.CharField(max_length=512, verbose_name="title of the Ad")
    description = models.TextField(verbose_name="description of the Ad")
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    status = models.CharField(max_length=30, choices=Status.choices)
    category = models.ForeignKey(to=Category, on_delete=models.CASCADE)


class AdAttributeValue(models.Model):
    value_number = models.DecimalField(decimal_places=2, max_digits=12, null=True)
    value_string = models.CharField(max_length=256, null=True)
    value_bool = models.BooleanField(null=True)
    value_date = models.DateField(null=True)
    attribute = models.ForeignKey(to=Attribute, on_delete=models.CASCADE)
    ad = models.ForeignKey(
        to=Ad, on_delete=models.CASCADE, related_name="attributes_values"
    )
