from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('add_job', views.add_job, name='add_job'),
]
