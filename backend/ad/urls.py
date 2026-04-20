from django.urls import path

from ad.views import (
    AdDetailView,
    AdListView,
)


urlpatterns = [
    path("", view=AdListView.as_view()),
    path("<int:id>/", view=AdDetailView.as_view()),
]
