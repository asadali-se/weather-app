from django.urls import path
from . import views

urlpatterns = [
    path('weather/', views.get_weather, name='get-weather'),
    path('forecast/', views.get_weather_forecast, name='get-weather-forecast'),
]
