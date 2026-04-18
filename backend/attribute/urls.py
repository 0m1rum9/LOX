from django.urls import path

from attribute.views import (
    AttributeDetailView,
    AttributeEnumValueDetailView,
    AttributeEnumValueListView,
    AttributeListView,
    attribute_enum_values,
    attribute_types,
)


urlpatterns = [
    path("", view=AttributeListView.as_view()),
    path("<int:id>/", view=AttributeDetailView.as_view()),
    path("<int:id>/enum-values", view=attribute_enum_values),
    path("enum-values/", view=AttributeEnumValueListView.as_view()),
    path("enum-values/<int:id>/", view=AttributeEnumValueDetailView.as_view()),
    path("types/", view=attribute_types),
]
