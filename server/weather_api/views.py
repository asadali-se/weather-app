from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
import os
from dotenv import load_dotenv
from collections import defaultdict

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
        
        weather_data = {
            'city': data['name'],
            'temperature': data['main']['temp'],
            'description': data['weather'][0]['description'],
            'humidity': data['main']['humidity'],
            'wind_speed': data['wind']['speed']
        }
        
        return Response(weather_data)
    
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to fetch weather data: {str(e)}'}, 
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )