from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
import os
from dotenv import load_dotenv

load_dotenv()

@api_view(['GET'])
def get_weather(request):
    city = request.query_params.get('city')

    api_key = os.getenv('WEATHER_API_KEY')
    if not api_key:
        return Response(
            {'error': 'API key not configured'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    
    try:
        response = requests.get(url)
        
        # Check if the request was successful
        if response.status_code == 404:
            return Response(
                {'error': f'City "{city}" not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        response.raise_for_status()  # Raise an exception for other bad responses
        
        data = response.json()

        # Get forecast data to calculate today's actual high/low
        forecast_url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric"
        forecast_response = requests.get(forecast_url)

        today_min = None
        today_max = None

        if forecast_response.status_code == 200:
            forecast_data = forecast_response.json()
            today_date = forecast_data['list'][0]['dt_txt'].split(' ')[0]

            for item in forecast_data['list']:
                item_date = item['dt_txt'].split(' ')[0]
                if item_date == today_date:
                    if today_min is None or item['main']['temp_min'] < today_min:
                        today_min = item['main']['temp_min']
                    if today_max is None or item['main']['temp_max'] > today_max:
                        today_max = item['main']['temp_max']

        # Fallback to current temp if forecast data unavailable
        if today_min is None:
            today_min = data['main']['temp']
        if today_max is None:
            today_max = data['main']['temp']

        weather_data = {
            'city': data['name'],
            'temperature': data['main']['temp'],
            'feels_like': data['main']['feels_like'],  # Feels like temperature
            'description': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon'],  # OpenWeatherMap icon code
            'humidity': data['main']['humidity'],
            'wind_speed': data['wind']['speed'],
            'wind_deg': data['wind'].get('deg', 0),  # Wind direction in degrees
            'visibility': data.get('visibility', 0) / 1000,  # Convert meters to km
            'pressure': data['main']['pressure'],  # Atmospheric pressure in hPa
            'temp_min': today_min,  # Today's actual minimum temperature
            'temp_max': today_max,  # Today's actual maximum temperature
            'dew_point': data['main'].get('temp_min', 0) - 10,  # Approximate dew point
            'country': data['sys'].get('country', ''),  # Country code
            'weather_code': data['weather'][0]['id'],  # Weather condition code
        }
        
        return Response(weather_data)
    
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to fetch weather data: {str(e)}'}, 
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
@api_view(['GET'])
def get_weather_forecast(request):
    city = request.query_params.get('city')
    api_key = os.getenv('WEATHER_API_KEY')
    if not api_key:
        return Response(
            {'error': 'API key not configured'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric"

    try:
        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 404:
            return Response(
                {'error': f'City "{city}" not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        response.raise_for_status()  # Raise an exception for other bad responses

        data = response.json()

        forecast_list = []
        for item in data['list']:
            forecast_list.append(
                {
                    "temp": item["main"]["temp"],
                    "temp_min": item["main"]["temp_min"],
                    "temp_max": item["main"]["temp_max"],
                    "description": item["weather"][0]["description"],
                    "icon": item["weather"][0]["icon"],  # OpenWeatherMap icon code
                    "weather_code": item["weather"][0]["id"],  # Weather condition code
                    "dt_txt": item["dt_txt"],
                    "humidity": item["main"]["humidity"],
                    "wind_speed": item["wind"]["speed"],
                    "pop": item.get("pop", 0) * 100,  # Probability of precipitation (0-100%)
                }
            )

        return Response({
            'forecast': forecast_list,
            'city': data['city']['name'],
            })

    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to fetch weather data: {str(e)}'}, 
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
