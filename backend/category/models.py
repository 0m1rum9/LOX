from django.db import models
from django.db.models.deletion import CASCADE

from attribute.models import Attribute
from treebeard.mp_tree import MP_Node


class Category(MP_Node):
    name = models.CharField(max_length=512)
    attributes = models.ForeignKey(to=Attribute, on_delete=CASCADE, null=True)
