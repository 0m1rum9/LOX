from django.urls import path

from user.views import get_user


urlpatterns = [
    path("<int:id>/", view=get_user),
]
