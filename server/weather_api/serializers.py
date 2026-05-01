from rest_framework import serializers

class WeatherDataSerializers(serializers.Serializer):
    city = serializers.CharField()
    temperature = serializers.FloatField()
    description = serializers.CharField()
    humidity = serializers.IntegerField()
    wind_speed = serializers.FloatField()

class ForecastItemSerializer(serializers.Serializer):
    timestamp = serializers.IntegerField()
    temperature = serializers.FloatField()
    description = serializers.CharField()
    humidity = serializers.IntegerField()
    wind_speed = serializers.FloatField()

class ForecastSerializer(serializers.Serializer):
    city = serializers.CharField()
    forecasts = ForecastItemSerializer(many=True)  # Changed to plural

class AirQualitySerializer(serializers.Serializer):
    city = serializers.CharField()
    aqi = serializers.IntegerField()
    co2 = serializers.FloatField()
    pm2_5 = serializers.FloatField()
    pm10 = serializers.FloatField()
    no2 = serializers.FloatField()
    so2 = serializers.FloatField()