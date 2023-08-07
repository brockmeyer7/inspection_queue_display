from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('update_jobs', views.update_jobs, name='update_jobs'),
]
