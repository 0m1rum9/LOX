from django.urls import path

from category.views import (
    CategoryDetailView,
    CategoryView,
)


urlpatterns = [
    path("", view=CategoryView.as_view(), name="category-tree"),
    path("<int:id>/", view=CategoryDetailView.as_view(), name="category-retrieve"),
]
