from django.urls import path

from category.views import CategoryDetailView, CategoryView, SubCategoriesView


urlpatterns = [
    path("", view=CategoryView.as_view(), name="category-list"),
    path("<int:id>/", view=CategoryDetailView.as_view(), name="category-retrieve"),
    path(
        "<int:id>/subcategories",
        view=SubCategoriesView.as_view(),
        name="category-subcategories",
    ),
]
