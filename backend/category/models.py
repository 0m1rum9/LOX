from django.db import models

from attribute.models import Attribute
from treebeard.mp_tree import MP_Node


class Category(MP_Node):
    name = models.CharField(max_length=512)
    attributes = models.ManyToManyField(to=Attribute, null=True)
